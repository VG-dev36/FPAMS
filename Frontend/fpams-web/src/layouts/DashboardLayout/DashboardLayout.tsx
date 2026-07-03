import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex" }}>

      <Header />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />

        <Outlet />

      </Box>

    </Box>
  );
}