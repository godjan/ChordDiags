import Vue from "vue";
import Vuetify from "vuetify";
import * as firebase from "firebase";
import "vuetify/dist/vuetify.min.css";
import router from "./router.js"
import storePlugin from "./storePlugin"

Vue.use(storePlugin)

Vue.use(Vuetify);
import App from "./App.vue";

new Vue({
  el: "#app",
  router,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyAJMK-hjtmaNx9fIYUeKftJeJcEAUjHmiE",
      authDomain: "tedgreene-diagrams.firebaseapp.com",
      databaseURL: "https://tedgreene-diagrams.firebaseio.com",
      projectId: "tedgreene-diagrams",
      storageBucket: "tedgreene-diagrams.appspot.com",
      messagingSenderId: "284562345798"
    });
  }
});
