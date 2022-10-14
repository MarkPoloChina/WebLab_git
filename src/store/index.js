import { createStore } from "vuex";

const parseToken = (token) => {
  let userinfo = JSON.parse(
    decodeURIComponent(
      escape(window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))
    )
  );
  return userinfo;
};
// 调用createStore
export default createStore({
  state: {
    token: null,
    tokenIHS: null,
    userObj: null,
    isAdmin:false
  },
  mutations: {
    updateToken(state, payload) {
      state.token = payload;
      localStorage.setItem("token", payload);
      state.userObj = parseToken(payload);
    },
    updateIHS(state, payload) {
      state.tokenIHS = payload;
      localStorage.setItem("IHS", payload);
    },
    initToken(state) {
      if (localStorage.getItem("token")) {
        state.token = localStorage.getItem("token");
        state.userObj = parseToken(localStorage.getItem("token"));
      }
      if (localStorage.getItem("IHS"))
        state.tokenIHS = localStorage.getItem("IHS");
    },
    clearToken(state) {
      localStorage.removeItem("token");
      state.token = null;
      localStorage.removeItem("IHS");
      state.tokenIHS = null;
      state.userObj = null;
    },
  },
  actions: {},
  getters: {},
  modules: {},
});
