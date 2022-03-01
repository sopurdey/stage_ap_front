import axios from "axios";

const url = "http://localhost:8290/api/carshare";

export default class CarshareApi {
  static getAll() {
    return axios.get(url + "/all");
  }

  static find(id) {
    return axios.get(url + `/${id}`);
  }

  static delete(id) {
    return axios.delete(url + `/${id}`);
  }

  static add(service) {
    return axios.post(url + service);
  }

  static update(id, service) {
    return axios.put(url + `/${id}`, service);
  }
}
