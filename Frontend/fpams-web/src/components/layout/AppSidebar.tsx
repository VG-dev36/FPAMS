import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

const menus = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Faculty", icon: <SchoolIcon /> },
    { text: "Departments", icon: <ApartmentIcon /> },
    { text: "Designations", icon: <BadgeIcon /> },
    { text: "Academic Years", icon: <CalendarMonthIcon /> },
    { text: "Appraisal", icon: <AssignmentIcon /> },
    { text: "Reports", icon: <AssessmentIcon /> },
    { text: "Settings", icon: <SettingsIcon /> },
];

const AppSidebar = () => {

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                >
                    FPAMS
                </Typography>

            </Toolbar>

            <Divider />

            <List>

                {menus.map((menu) => (

                    <ListItem
                        key={menu.text}
                        disablePadding
                    >

                        <ListItemButton>

                            <ListItemIcon>
                                {menu.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={menu.text}
                            />

                        </ListItemButton>

                    </ListItem>

                ))}

            </List>

            <Divider />

            <List>

                <ListItem disablePadding>

                    <ListItemButton>

                        <ListItemIcon>

                            <LogoutIcon />

                        </ListItemIcon>

                        <ListItemText
                            primary="Logout"
                        />

                    </ListItemButton>

                </ListItem>

            </List>

        </Drawer>

    );

};

export default AppSidebar;