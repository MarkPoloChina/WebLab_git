import { createStore } from "vuex";

// 调用createStore
export default createStore({
  state: {
    token: null,
    tokenIHS: null,
    isAdmin: false,
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload;
      localStorage.setItem("token", payload);
    },
    updateIHS(state, payload) {
      state.tokenIHS = payload;
      localStorage.setItem("IHS", payload);
    },
    updateIsAdmin(state, payload) {
      state.isAdmin = payload;
      localStorage.setItem("isAdmin", payload);
    },
    initToken(state) {
      if (localStorage.getItem("token"))
        state.token = localStorage.getItem("token");
      if (localStorage.getItem("IHS"))
        state.tokenIHS = localStorage.getItem("IHS");
      if (localStorage.getItem("isAdmin"))
        state.isAdmin = localStorage.getItem("isAdmin");
    },
    clearToken(state) {
      localStorage.removeItem("token");
      state.token = null;
      localStorage.removeItem("IHS");
      state.tokenIHS = null;
      localStorage.removeItem("isAdmin");
      state.isAdmin = false;
    },
  },
  actions: {},
  getters: {},
  modules: {},
});
