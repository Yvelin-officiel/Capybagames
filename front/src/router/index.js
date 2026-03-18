import { createRouter, createWebHistory } from "vue-router";
import Charte from "../pages/Charte.vue";
import Accueil from "../pages/Accueil.vue";

const routes = [
  {
    path: "/",
    name: "Accueil",
    component: Accueil,
  },
  {
    path: "/charte",
    name: "Charte",
    component: Charte,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
