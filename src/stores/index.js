import Vue from "vue";
import Vuex from "vuex";
import VehicleApi from "../services/VehicleApi";
import UserApi from "../services/UserApi";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    listVehicles: null,
    listUsers: null,
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
    getAllUsers: (state) => {
      return state.listUsers;
    },
    allUsers: (state) => {
      UserApi.getAll().then((response) => {
        state.listUsers = response.data;
        console.log("in allUsers");
        console.log(state.listUsers);
      });
    },
    addListUsers: (state) => (user) => {
      console.log('state');
      console.log(state);
      console.log('user');
      console.log(user);
      //state.listUsers.push(user);
    },
  },
});
