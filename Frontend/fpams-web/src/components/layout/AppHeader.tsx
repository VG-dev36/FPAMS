import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar
} from "@mui/material";

const AppHeader = () => {

    return (

        <AppBar
            position="fixed"
            sx={{
                zIndex: 1201
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    Faculty Performance Appraisal Management System
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Avatar>
                    A
                </Avatar>

            </Toolbar>

        </AppBar>

    );

};

export default AppHeader;