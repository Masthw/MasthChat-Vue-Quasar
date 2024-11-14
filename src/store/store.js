import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, update, get, onValue } from "firebase/database";
import { firebaseApp } from "boot/firebase";

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const state = {
  userDetails: {},
  users: {},
};
const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  addUser(state, { userId, userDetails }) {
    state.users[userId] = userDetails;
  },
};
const actions = {
  registerUser({}, payload) {
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((response) => {
        console.log(response);
        const userId = auth.currentUser.uid;
        set(ref(db, "users/" + userId), {
          name: payload.name,
          email: payload.email,
          online: true,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  loginUser({ commit, dispatch }, payload) {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((response) => {
        console.log("Usuário logado:", response);
        const userId = auth.currentUser.uid;
        const userRef = ref(db, "users/" + userId);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userDetails = snapshot.val();
              commit("setUserDetails", {
                userId: userId,
                name: userDetails.name,
                email: userDetails.email,
              });

              dispatch("firebaseUpdateUser", {
                userId: userId,
                updates: { online: true },
              });
              // Redireciona para a página inicial após o login
              this.$router.push("/");
            } else {
              console.log("Dados do usuário não encontrados");
            }
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
          });
      })
      .catch((error) => {
        console.log("Erro de login:", error.message);
      });
  },
  logoutUser({ commit, state, dispatch }) {
    const userId = state.userDetails.userId;
    if (userId) {
      dispatch("firebaseUpdateUser", {
        userId: userId,
        updates: { online: false },
      });
    }

    signOut(auth)
      .then(() => {
        // Limpar os dados do usuário no Vuex
        commit("setUserDetails", {});
        console.log("Usuário deslogado com sucesso");
      })
      .catch((error) => {
        console.log("Erro ao deslogar:", error.message);
      });
  },
  handleAuthStateChanged({ commit, dispatch, state }) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado.
        const userId = user.uid;

        // Buscar os detalhes do usuário na base de dados
        const userRef = ref(db, "users/" + userId);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userDetails = snapshot.val();
              // Atualizar o estado com os detalhes do usuário
              commit("setUserDetails", {
                userId: userId,
                name: userDetails.name,
                email: userDetails.email,
              });
              // Atualizar o status 'online' do usuário
              dispatch("firebaseUpdateUser", {
                userId: userId,
                updates: { online: true },
              });
              dispatch("firebaseGetUsers");
              // Redireciona para a página principal após login
              this.$router.push("/");
            }
          })
          .catch((error) => {
            console.log("Erro ao buscar dados do usuário:", error);
          });
      } else {
        // Usuário deslogado.
        const userId = state.userDetails.userId;
        if (userId) {
          dispatch("firebaseUpdateUser", {
            userId: state.userDetails.userId,
            updates: { online: false },
          });
        }
        commit("setUserDetails", {}); // Limpa os dados do usuário
        this.$router.replace("/auth"); // Redireciona para a página de login
      }
    });
  },

  firebaseUpdateUser({}, payload) {
    if (payload.userId) {
      const userRef = ref(db, "users/" + payload.userId);
      update(userRef, payload.updates)
        .then(() => {
          console.log("Status do usuário atualizado com sucesso");
        })
        .catch((error) => {
          console.error("Erro ao atualizar status do usuário:", error);
        });
    }
  },
  firebaseGetUsers({ commit }) {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          const userDetails = childSnapshot.val();
          commit("addUser", {
            userId,
            userDetails,
          });
        });
      } else {
        console.log("Nenhum usuário encontrado");
      }
    }),
      (error) => {
        console.log("Erro ao buscar usuários:", error);
      };
  },
};
const getters = {
  users: (state) => {
    const usersFiltered = {};
    Object.keys(state.users).forEach((key) => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key];
      }
    });
    return usersFiltered;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
