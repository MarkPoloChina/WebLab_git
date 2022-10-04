import { createStore } from "vuex";

// 调用createStore
export default createStore({
  state: {
    token: null,
    tokenIHS: null,
  },
  mutations: {
    // 定义mutations，用于修改状态(同步)
    updateToken(state, payload) {
      state.token = payload;
      localStorage.setItem("token", payload);
    },
    updateIHS(state, payload) {
      state.tokenIHS = payload;
      localStorage.setItem("IHS", payload);
    },
    initToken(state) {
      if (localStorage.getItem("token"))
        state.token = localStorage.getItem("token");
      if (localStorage.getItem("IHS"))
        state.tokenIHS = localStorage.getItem("IHS");
    },
    clearToken(state) {
      localStorage.removeItem("token");
      state.token = null;
      localStorage.removeItem("IHS");
      state.tokenIHS = null;
    },
  },
  actions: {
    // 定义actions，用于修改状态(异步)
    // 2秒后更新状态
    updateToken(context, payload) {
      setTimeout(() => {
        context.commit("updateToken", payload);
      }, 1000);
    },
  },
  getters: {
    // 定义一个getters
    formatInfo(state) {
      //getters的方法
      return state.token + " Tom";
    },
  },
  modules: {},
});
