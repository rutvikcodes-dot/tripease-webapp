import api from "./axios";

const BASE_URL = "/cities";

export const getCities = () => {
  return api.get(BASE_URL);
};