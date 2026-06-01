import api from "./axios";

const BASE_URL = "/bookings";

export const createBooking = (bookingData) => {
  return api.post(BASE_URL, bookingData);
};

export const getMyBookings = () => {
  return api.get(`${BASE_URL}/my-bookings`);
};

export const getBookingById = (bookingId) => {
  return api.get(`${BASE_URL}/${bookingId}`);
};
