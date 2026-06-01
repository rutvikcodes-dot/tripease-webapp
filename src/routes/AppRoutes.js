import { Routes, Route } from "react-router-dom";
import Landing from "../pages/layout/Landing.js";
import Layout from "../pages/layout/Layout.js";
import HotelsList from "../pages/hotels/HotelsList.js";
import HotelDetails from "../pages/hotels/HotelDetails.js";
import RoomDetails from "../pages/rooms/RoomDetails.js";
import BookingDetails from "../pages/booking/BookingDetails.js";
import MyBookings from "../pages/booking/MyBookings.js";
import BookingSuccess from "../pages/booking/BookingSuccess.js";
import CheckoutDetails from "../pages/payment/CheckoutDetails.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />

        <Route path="/hotels" element={<HotelsList />} />

        <Route path="/hotel-details/:id" element={<HotelDetails />} />

        <Route path="/room/:hotelId/:roomId" element={<RoomDetails />} />

        <Route path="/booking/:hotelId/:roomId" element={<BookingDetails />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route
          path="/checkout/:hotelId/:roomId"
          element={<CheckoutDetails />}
        />

        <Route
          path="/booking-success/:bookingId"
          element={<BookingSuccess />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
