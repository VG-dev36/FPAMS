import {
    Box,
    Toolbar
} from "@mui/material";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";

interface Props {

    children: React.ReactNode;

}

const AppLayout = ({ children }: Props) => {

    return (

        <Box sx={{ display: "flex" }}>

            <AppHeader />

            <AppSidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >

                <Toolbar />

                {children}

                <AppFooter />

            </Box>

        </Box>

    );

};

export default AppLayout;