import VehicleApi from "../services/VehicleAPi";

export const GestionVehicles = {
  state: {
    monState: "State Store 01",
    listVehicles: null,
  },
  getters: {
    getVehicles: (state) => {
      return state.listVehicles;
    },
    allVehicles: (state) => {
      VehicleApi.getAll().then((response) => {
        state.listVehicles = response.data;
        console.log(state.listVehicles);
      });
    },
    addListeVehicle: (state) => (vehicle) => {
      VehicleApi.add(vehicle).then(() => {
        state.getters.allVehicles();
      });
    },
  },
};
