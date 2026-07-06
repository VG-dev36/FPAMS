import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import authService from "../../services/authService";

export default function Header() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const logout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">
          FPAMS
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          {user && (
            <Typography variant="body2">
              {user.fullName} ({user.role})
            </Typography>
          )}

          <Button
            color="inherit"
            onClick={logout}
          >
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
