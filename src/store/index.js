import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import auth from "./auth";

export default new Vuex.Store({
    namespaced: true,
    name: "global",
    modules: {
        auth
    }
});