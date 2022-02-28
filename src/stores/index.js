import Vue from "vue";
import Vuex from "vuex";
import { GestionVehicles } from "./storeVehicle";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    vehicle : GestionVehicles,
  },
});
