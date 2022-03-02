import axios from "axios";

const url = "http://localhost:8290/api/vehicle";

export default class VehicleApi {
  static getAll() {
    return axios.get(url + "/all");
  }

  static find(id) {
    return axios.get(url + `/${id}`);
  }

  static delete(id) {
    return axios.delete(url + `/${id}`);
  }

  static add(vehicle) {
    return axios.post(url, vehicle);
  }

  static update(id, service) {
    return axios.put(url + `/${id}`, service);
  }
}
