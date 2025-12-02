import { createRouter, createWebHistory } from "vue-router";
import ClanView from '../views/ClanView.vue'
const routes = [
  {
    path: '/clan',
    name: 'Clan',
    component: ClanView
  },
  {
    path: '/player/:tag',
    name: 'PlayerDetails',
    component: () => import('../views/PlayerDetails.vue'),
  },
  {
    path: '/ClanCWL',
    name: 'ClanCWL',
    component: () => import('../views/ClanCWL.vue'),
  },
  {
    path: '/cwl/war/:warTag',
    name: 'CWLWarDetails',
    component: () => import('../views/CWLWarDetails.vue')
  },
  {
    path: '/clan/:clanTag/stats',
    name: 'ClanMembersStats',
    component: () => import('../views/ClanMembersStats.vue')
  },
  {
    path: "/all-clans",
    name: "AllClans",
    component: () => import("../views/AllClans.vue"),
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;