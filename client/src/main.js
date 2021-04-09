/*!

=========================================================
* BootstrapVue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import DashboardPlugin from "./plugins/dashboard-plugin";
import App from "./App.vue";

// router setup
import router from "./routes/router";

import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";
// plugin setup
Vue.use(DashboardPlugin);

const socket = io(process.env.VUE_APP_SOCKETIO_HOST_ORIGIN, {
  path: '/socket-io'
});

Vue.use(VueSocketIOExt, socket);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router
});
