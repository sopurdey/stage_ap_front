import Vue from "vue";
import Vuex from "vuex";
import VehicleApi from "../services/VehicleAPi";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    listVehicles: null,
  },
  getters: {
    getAllVehicles: (state) => {
      return state.listVehicles;
    },
    allVehicles: (state) => {
      VehicleApi.getAll().then((response) => {
        state.listVehicles = response.data;
        console.log('in allVehicles');
        console.log(state.listVehicles);
      });
    },
    addListVehicles: (state) => (vehicle) => {
      VehicleApi.add(vehicle).then(() => {
        state.getters.allVehicles();
      });
    },
  },
});
