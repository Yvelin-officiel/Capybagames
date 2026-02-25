import { createRouter, createWebHistory } from "vue-router";
import Charte from "../pages/Charte.vue";

const routes = [
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
