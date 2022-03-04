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

  static add(carshare) {
    return axios.post(url, carshare);
  }

  static update(id, carshare) {
    return axios.put(url + `/${id}`, carshare);
  }
}
