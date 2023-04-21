import HomeView from "@/views/HomeView.vue"
import NotFoundView from "@/views/NotFoundView.vue"
import {
  createRouter,
  createWebHistory,
  type RouteComponent,
  type RouteLocation,
  type RouteRecordRaw,
} from "vue-router"
// import { collapseSideBar } from "@/utils/commonUtils"

// also be used for App.vue
export const routes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/about",
    name: "about",
  },
  {
    path: "/folder/:name",
    name: "folder",
  },
]

const beforeEnterAction = (to: RouteLocation, from: RouteLocation) => {
  // collapseSideBar()
}

// route mapping
const routeMap: {
  [key: string]: RouteComponent | Function
} = {
  home: {
    component: HomeView,
    beforeEnter: [beforeEnterAction],
  },
  about: {
    component: () => import("@/views/AboutView.vue"),
    beforeEnter: [beforeEnterAction],
  },
  folder: {
    component: () => import("@/views/FolderView.vue"),
    beforeEnter: [beforeEnterAction],
  },
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...(routes.map((route) => ({
      ...route,
      ...routeMap[route.name],
    })) as RouteRecordRaw[]),
    { path: "/:pathMatch(.*)*", component: NotFoundView },
  ],
})

export default router
