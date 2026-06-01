import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { AuthProvider } from "./pages/auth/provider.js";
import { HotelProvider } from "./pages/hotels/provider.js";
import { RoomProvider } from "./pages/rooms/provider.js";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import { BookingProvider } from "./pages/booking/provider.js";
import { PaymentProvider } from "./pages/payment/provider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{
          primaryColor: "indigo",
          defaultRadius: "md",
        }}
      >
        <Notifications />
        <AuthProvider>
          <HotelProvider>
            <RoomProvider>
              <BookingProvider>
                <PaymentProvider>
                  <App />
                </PaymentProvider>
              </BookingProvider>
            </RoomProvider>
          </HotelProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
