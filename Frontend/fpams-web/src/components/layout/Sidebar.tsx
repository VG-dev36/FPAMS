import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const drawerWidth = 240;

export default function Sidebar() {
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

        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Departments" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Academic Years" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Designations" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Users" />
        </ListItemButton>

      </List>

    </Drawer>
  );
}