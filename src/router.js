import Vue from 'vue'
import VueRouter from "vue-router";
import Home from "./Views/Home";
import Login from "./Views/Login";
import Create from "./Views/Create"
import Sheet from "./Views/Sheet"

Vue.use(VueRouter);

export default new VueRouter({
  
  mode: "history",

  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path:"/login",
      component:Login
    },
    {
      path:"/create",
      component: Create
    },
    {
      path:"/sheet/:id?",
      component: Sheet
    },
    {
      path: "*",
      component: Home
    }
  ]
});