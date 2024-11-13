import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { firebaseApp } from "src/boot/firebase";

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const state = {};
const mutations = {};
const actions = {
  registerUser({}, payload) {
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((response) => {
        console.log(response);
        const userId = auth.currentUser.uid;
        console.log("Usuário registrado com ID:", userId);
        const userRef = ref(db, "users/" + userId);
        set(userRef, {
          email: payload.email,
          name: payload.name,
          online: true,
        })
          .then(() => {
            console.log("Usuário salvo no Firebase");
          })
          .catch((dbError) => {
            console.log("Erro ao salvar usuário:", dbError.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  },
  loginUser({}, payload) {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((response) => {
        console.log("Usuário autenticado:", response);

        const userId = auth.currentUser.uid;
        console.log("ID do usuário autenticado:", userId);

        const userRef = ref(db, "users/" + userId);
        set(userRef, {
          online: true,
        })
          .then(() => {
            console.log("Status do usuário atualizado para online no Firebase");
          })
          .catch((dbError) => {
            console.log(
              "Erro ao atualizar status de usuário:",
              dbError.message
            );
          });
      })
      .catch((error) => {
        console.log("Erro ao fazer login:", error.message);
      });
  },
};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
