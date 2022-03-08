import axios from "axios";

const url = "http://localhost:8290/api/user";

export default class UserApi {
  static getAll() {
    return axios.get(url + "/all");
  }

  static find(id) {
    return axios.get(url + `/${id}`);
  }

  static delete(id) {
    return axios.delete(url + `/${id}`);
  }

  static add(user) {
    return axios.post(url, user);
  }

  static update(id, user) {
    return axios.put(url + `/${id}`, user);
  }
}
