import api from "./axios";

const BASE_URL = "/ai";

export const createTripPlan = (payload) => {
  return api.post(`${BASE_URL}/trip-plan`, payload);
};
