import axios from "axios";

const url = "http://localhost:8290/api/reservation";

export default class ReservationApi {
  static getAll() {
    return axios.get(url + "/all");
  }

  static find(id) {
    return axios.get(url + `/${id}`);
  }

  static delete(id) {
    return axios.delete(url + `/${id}`);
  }

  static add(reservation) {
    return axios.post(url, reservation);
  }

  static update(id, reservation) {
    return axios.put(url + `/${id}`, reservation);
  }
}
