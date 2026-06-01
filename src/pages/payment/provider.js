import { createContext, useContext, useState } from "react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useBooking } from "../booking/provider";
import { useHotel } from "../hotels/provider";
import { useRoom } from "../rooms/provider";
import { createBooking } from "../../api/bookingApi";
import { useNavigate } from "react-router-dom";
import { BOOKING_GUEST_DETAILS_STORAGE_KEY } from "../../utils/constants";

const PaymentContext = createContext();

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const getSavedGuestDetails = () => {
  try {
    const storedGuestDetails = sessionStorage.getItem(
      BOOKING_GUEST_DETAILS_STORAGE_KEY,
    );

    return storedGuestDetails ? JSON.parse(storedGuestDetails) : null;
  } catch {
    return null;
  }
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function PaymentProvider({ children }) {
  const { selectedHotel, checkIn, checkOut, adults, getRoomPricing } =
    useHotel();
  const { selectedRoom } = useRoom();
  const { guestDetails } = useBooking();
  const navigate = useNavigate();
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const getGuestDetailsForPayment = () => {
    if (guestDetails.fullName && guestDetails.email && guestDetails.phone) {
      return guestDetails;
    }

    return getSavedGuestDetails() || guestDetails;
  };

  const openPayment = async ({
    amount,
    hotelName,
    paymentGuestDetails,
    pricing,
  }) => {
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      notifications.show({
        title: "Razorpay key missing",
        message:
          "Add REACT_APP_RAZORPAY_KEY_ID to your .env file and restart npm start.",
        color: "red",
      });
      return;
    }

    const isRazorpayLoaded = await loadRazorpayScript();

    if (!isRazorpayLoaded) {
      notifications.show({
        title: "Razorpay did not load",
        message:
          "Check your internet connection or browser console, then try again.",
        color: "red",
      });
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amount * 100,
      currency: "INR",
      name: "TripEase",
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      description: `${hotelName} Booking`,
      prefill: {
        name: paymentGuestDetails.fullName,
        email: paymentGuestDetails.email,
        contact: paymentGuestDetails.phone,
      },
      theme: {
        color: "#228be6",
      },
      handler: async function (response) {
        try {
          setIsBookingLoading(true);

          const bookingPayload = {
            hotelId: selectedHotel.id,
            roomId: selectedRoom.id,
            guestName: paymentGuestDetails.fullName,
            guestEmail: paymentGuestDetails.email,
            guestPhone: paymentGuestDetails.phone,
            specialRequest: paymentGuestDetails.specialRequest,
            guests: adults,
            checkInDate: dayjs(checkIn).format("YYYY-MM-DD"),
            checkOutDate: dayjs(checkOut).format("YYYY-MM-DD"),
            subtotal: pricing.subtotal,
            taxes: pricing.taxes,
            totalPrice: pricing.total,
            paymentId: response.razorpay_payment_id,
          };

          const booking = await createBooking(bookingPayload);
          const successMessage =
            booking.data?.message || "Your booking has been confirmed.";
          const bookingId = booking.data?.data?.id;

          notifications.show({
            title: "Booking Successful",
            message: successMessage,
            color: "green",
          });

          const successUrl = bookingId
            ? `/booking-success/${bookingId}`
            : "/booking-success";

          navigate(successUrl);
        } catch (error) {
          console.error("BOOKING CREATE ERROR:", error);

          notifications.show({
            title: "Booking failed",
            message: error?.response?.data?.message || "Could not save booking",
            color: "red",
          });
        } finally {
          setIsBookingLoading(false);
        }
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      notifications.show({
        title: "Payment popup failed",
        message:
          error.message || "Please check your Razorpay setup and try again.",
        color: "red",
      });
    }
  };

  const handlePayment = () => {
    if (isBookingLoading) return;

    if (!selectedHotel || !selectedRoom) {
      notifications.show({
        title: "Booking details missing",
        message: "Please select a room before continuing to payment.",
        color: "red",
      });
      return;
    }

    const pricing = getRoomPricing(selectedRoom.pricePerNight);
    const paymentGuestDetails = getGuestDetailsForPayment();

    if (
      !paymentGuestDetails.fullName ||
      !paymentGuestDetails.email ||
      !paymentGuestDetails.phone
    ) {
      notifications.show({
        title: "Guest details missing",
        message: "Please go back and fill guest details before payment.",
        color: "red",
      });
      return;
    }

    openPayment({
      amount: pricing.total,
      hotelName: selectedHotel.name,
      paymentGuestDetails,
      pricing,
    });
  };

  return (
    <PaymentContext.Provider
      value={{ openPayment, handlePayment, isBookingLoading }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
