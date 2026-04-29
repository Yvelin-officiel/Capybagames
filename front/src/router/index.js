import { createRouter, createWebHistory } from "vue-router";
import Charte from "../pages/Charte.vue";
import Accueil from "../pages/Accueil.vue";
import JetpackCapy from "../pages/JetpackCapy.vue";
import FiveNightAtCapys from "../pages/FiveNightAtCapys.vue";
import CapySnake from "../pages/CapySnake.vue";

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
  {
    path: "/games/fivenightatcapys",
    name: "FiveNightAtCapys",
    component: FiveNightAtCapys,
  },
  {
    path: "/games/capysnake",
    name: "CapySnake",
    component: CapySnake,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;
