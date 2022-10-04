// skl-blog/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Resource from "../components/Resource.vue";
import Publications from "../components/Publication.vue";
import Upload from "../components/upload.vue";
import Index from "../components/Index.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Index,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "publications",
        name: "Publications",
        component: Publications,
      },
      {
        path: "resource",
        name: "Resource",
        component: Resource,
      },
      {
        path: "/upload",
        name: "Upload",
        component: Upload,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
