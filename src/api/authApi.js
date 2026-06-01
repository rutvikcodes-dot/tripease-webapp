import api from "./axios";

const BASE_URL = "/auth";

export const login = (payload) => {
  return api.post(`${BASE_URL}/login`, payload);
};

export const register = (payload) => {
  return api.post(`${BASE_URL}/sign-up`, payload);
};

export const getProfile = () => {
  return api.get(`${BASE_URL}/profile`);
};

export const logoutUser = () => {
  return api.post(`${BASE_URL}/logout`);
};
