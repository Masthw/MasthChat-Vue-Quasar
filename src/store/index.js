import { createStore } from "vuex";
import store from "./store";

export default createStore({
  modules: {
    store,
  },
  strict: process.env.DEV,
});
