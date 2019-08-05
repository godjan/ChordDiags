import Vue from 'vue'
import VueRouter from "vue-router";
import Home from "./Views/Home";
import Signin from "./Components/User/Signin";
import Signup from "./Components/User/Signup";
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
      path:"/signin",
      component:Signin
    },
    {
      path:"/signup",
      component:Signup
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