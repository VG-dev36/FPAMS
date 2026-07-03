import {
    Box,
    Typography
} from "@mui/material";

const AppFooter = () => {

    return (

        <Box
            sx={{
                py: 2,
                textAlign: "center",
            }}
        >

            <Typography
                variant="body2"
                color="text.secondary"
            >
                © 2026 FPAMS
            </Typography>

        </Box>

    );

};

export default AppFooter;