import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { getNavigationForUser } from "../../config/roleAccess";
import authService from "../../services/authService";

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationItems = getNavigationForUser(authService.getUser());

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar />

      <List>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

      </List>

    </Drawer>
  );
}
