import { Typography, Box } from "@mui/material";

interface Props {
    title: string;
    subtitle?: string;
}

const PageHeader = ({ title, subtitle }: Props) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="h4"
                sx={{ fontWeight: "bold" }}
            >
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default PageHeader;