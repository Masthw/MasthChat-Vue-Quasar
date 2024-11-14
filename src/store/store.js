import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, update, get } from "firebase/database";
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
  loginUser({ commit }, payload) {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((response) => {
        console.log("Usuário logado:", response);

        // Após o login, recuperar os dados do usuário do Firebase
        const userId = auth.currentUser.uid;

        // Buscar dados do usuário no Realtime Database
        const userRef = ref(db, "users/" + userId);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userDetails = snapshot.val();
              // Atualiza o estado com os dados do usuário
              commit("setUserDetails", {
                userId: userId,
                name: userDetails.name,
                email: userDetails.email,
              });
              // Redireciona para a página inicial após o login
              this.$router.push("/"); // Vai para a tela inicial após o login
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
      // Atualiza o status online para false antes de fazer o logout
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
      const userRef = ref(db, "users/" + payload.userId); // Usando o ref de forma modular
      update(userRef, payload.updates) // Atualizando o status
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
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key; // A chave do usuário
            const userDetails = childSnapshot.val();
            commit("addUser", {
              userId,
              userDetails,
            });
          });
        } else {
          console.log("Nenhum usuário encontrado");
        }
      })
      .catch((error) => {
        console.log("Erro ao buscar usuários:", error);
      });
  },
};
const getters = {
  users: (state) => {
    return Object.values(state.users);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
