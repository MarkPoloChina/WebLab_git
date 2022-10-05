// skl-blog/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "../view/Login.vue";
import Home from "../view/Home.vue";
import Resource from "../view/Resource.vue";
import Publications from "../view/Publication.vue";
import Upload from "../view/upload.vue";
import Index from "../view/Index.vue";
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
