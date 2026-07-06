import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import authService from "../../services/authService";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@fpams.com");
    const [password, setPassword] = useState("Admin@123");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);
            const result = await authService.login({ email, password });

            if (!result.success) {
                setError(result.message || "Login failed.");
                return;
            }

            navigate("/", { replace: true });
        } catch {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Paper
                component="form"
                onSubmit={handleLogin}
                variant="outlined"
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: 4,
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700 }}
                        >
                            FPAMS
                        </Typography>
                        <Typography color="text.secondary">
                            Sign in to manage faculty appraisals.
                        </Typography>
                    </Box>

                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        fullWidth
                        required
                        autoFocus
                    />

                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        fullWidth
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </Stack>
            </Paper>

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() => setError(null)}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
