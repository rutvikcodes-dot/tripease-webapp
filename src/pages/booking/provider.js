import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import { useHotel } from "../hotels/provider";
import { useRoom } from "../rooms/provider";
import { buildHotelSearchParams } from "../hotels/components/filters/filterUtils";
import { getMyBookings } from "../../api/bookingApi";
import { BOOKING_GUEST_DETAILS_STORAGE_KEY } from "../../utils/constants";

const BookingContext = createContext();

const DEFAULT_GUEST_DETAILS = {
  fullName: "",
  email: "",
  phone: "",
  specialRequest: "",
};

const getStoredGuestDetails = () => {
  try {
    const storedGuestDetails = sessionStorage.getItem(
      BOOKING_GUEST_DETAILS_STORAGE_KEY,
    );

    return storedGuestDetails
      ? { ...DEFAULT_GUEST_DETAILS, ...JSON.parse(storedGuestDetails) }
      : DEFAULT_GUEST_DETAILS;
  } catch {
    return DEFAULT_GUEST_DETAILS;
  }
};

export function BookingProvider({ children }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { filters, selectedHotel } = useHotel();
  const { selectedRoom } = useRoom();
  const [showPolicies, setShowPolicies] = useState(false);
  const [guestDetails, setGuestDetails] = useState(getStoredGuestDetails);
  const [errors, setErrors] = useState({});
  const [myBookings, setMyBookings] = useState([]);
  const [myBookingsLoading, setMyBookingsLoading] = useState(false);
  const [myBookingsError, setMyBookingsError] = useState("");

  const sortedMyBookings = useMemo(() => {
    return [...myBookings].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [myBookings]);

  const fetchMyBookings = useCallback(async () => {
    try {
      setMyBookingsLoading(true);
      setMyBookingsError("");

      const response = await getMyBookings();
      setMyBookings(response.data.data || []);
    } catch (error) {
      setMyBookingsError(
        error.response?.data?.message || "Could not load your bookings.",
      );
    } finally {
      setMyBookingsLoading(false);
    }
  }, []);

  const resetMyBookings = useCallback(() => {
    setMyBookings([]);
    setMyBookingsError("");
    setMyBookingsLoading(false);
  }, []);

  const handleGuestDetailsChange = (field) => (event) => {
    const value = event.target.value;

    setGuestDetails((prev) => {
      const nextGuestDetails = {
        ...prev,
        [field]: value,
      };

      sessionStorage.setItem(
        BOOKING_GUEST_DETAILS_STORAGE_KEY,
        JSON.stringify(nextGuestDetails),
      );

      return nextGuestDetails;
    });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!guestDetails.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }
    if (!guestDetails.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(guestDetails.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!guestDetails.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(guestDetails.phone)) {
      nextErrors.phone = "Enter a valid 10 digit phone number";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToBooking = () => {
    const params = buildHotelSearchParams({
      filters,
    });
    const hotelId = selectedHotel?.id || selectedRoom?.hotelId;
    if (!hotelId || !selectedRoom?.id) {
      return;
    }
    navigate({
      pathname: `/booking/${hotelId}/${selectedRoom.id}`,
      search: params.toString() ? `?${params.toString()}` : "",
    });
  };

  const goToPayment = () => {
    if (!validateForm()) {
      notifications.show({
        title: "Check your details",
        message: "Please fix the highlighted fields.",
        color: "red",
      });
      return;
    }
    const hotelId = selectedHotel?.id || selectedRoom?.hotelId;
    if (!hotelId || !selectedRoom?.id) {
      return;
    }

    sessionStorage.setItem(
      BOOKING_GUEST_DETAILS_STORAGE_KEY,
      JSON.stringify(guestDetails),
    );

    navigate({
      pathname: `/checkout/${hotelId}/${selectedRoom.id}`,
      search,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        guestDetails,
        errors,
        handleGuestDetailsChange,
        goToBooking,
        goToPayment,
        showPolicies,
        setShowPolicies,
        myBookings,
        sortedMyBookings,
        myBookingsLoading,
        myBookingsError,
        fetchMyBookings,
        resetMyBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
