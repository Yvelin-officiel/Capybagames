import { createRouter, createWebHistory } from "vue-router";
import Charte from "../pages/Charte.vue";
import Accueil from "../pages/Accueil.vue";
import JetpackCapy from "../pages/JetpackCapy.vue";

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
  {
    path: "/games/jetpackcapy",
    name: "JetpackCapy",
    component: JetpackCapy,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
