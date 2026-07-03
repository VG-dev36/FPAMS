import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",
    },
    secondary: {
      main: "#00897B",
    },
    background: {
      default: "#F5F7FA",
    },
  },

  typography: {
    fontFamily: "Segoe UI, Roboto, Arial",
  },

  shape: {
    borderRadius: 8,
  },
});

export default theme;