import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import router from "./router.js"
import storePlugin from "./storePlugin"

Vue.use(storePlugin)

Vue.use(Vuetify);

import App from "./App.vue";

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
