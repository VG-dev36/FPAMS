import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 5
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;