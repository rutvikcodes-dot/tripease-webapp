import api from "./axios";

const BASE_URL = "/hotels";

export const getHotels = (filters) => {
  return api.get(BASE_URL, {
    params:  filters,
  });
};

export const getHotelById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};
