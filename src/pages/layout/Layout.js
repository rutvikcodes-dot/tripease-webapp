import { Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js";

export default function Layout() {
  return (
    <Box
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        component="main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
