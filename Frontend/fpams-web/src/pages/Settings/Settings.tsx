import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    FormControlLabel,
    Grid,
    Paper,
    Snackbar,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import PageHeader from "../../components/common/PageHeader/PageHeader";
import healthService, { type ApiHealth, type DatabaseHealth } from "../../services/healthService";

interface AppSettings {
    institutionName: string;
    appraisalWindowDays: number;
    minimumEvidenceFiles: number;
    enableNotifications: boolean;
    allowFacultyEditAfterReturn: boolean;
}

const storageKey = "fpams-settings";

const defaultSettings: AppSettings = {
    institutionName: "Engineering College",
    appraisalWindowDays: 30,
    minimumEvidenceFiles: 1,
    enableNotifications: true,
    allowFacultyEditAfterReturn: true,
};

const Settings = () => {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
    const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(null);
    const [healthError, setHealthError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const savedSettings = localStorage.getItem(storageKey);

        if (savedSettings) {
            setSettings({
                ...defaultSettings,
                ...JSON.parse(savedSettings),
            });
        }

        void loadHealth();
    }, []);

    const loadHealth = async () => {
        try {
            setHealthError(null);
            const [apiResponse, databaseResponse] = await Promise.all([
                healthService.getApiHealth(),
                healthService.getDatabaseHealth(),
            ]);

            setApiHealth(apiResponse.data ?? null);
            setDatabaseHealth(databaseResponse.data ?? null);
        } catch {
            setApiHealth(null);
            setDatabaseHealth(null);
            setHealthError("Unable to reach API or database health checks.");
        }
    };

    const updateSetting = <TKey extends keyof AppSettings>(
        key: TKey,
        value: AppSettings[TKey]
    ) => {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const saveSettings = () => {
        localStorage.setItem(storageKey, JSON.stringify(settings));
        setMessage("Settings saved.");
    };

    return (
        <Box>
            <PageHeader
                title="Settings"
                subtitle="Configure institution-level defaults used across appraisal workflows."
            />

            <Paper
                variant="outlined"
                sx={{ p: 3 }}
            >
                <Grid
                    container
                    spacing={3}
                >
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Institution Name"
                            value={settings.institutionName}
                            onChange={(event) => updateSetting("institutionName", event.target.value)}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Appraisal Window"
                            type="number"
                            value={settings.appraisalWindowDays}
                            onChange={(event) => updateSetting("appraisalWindowDays", Number(event.target.value))}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Minimum Evidence Files"
                            type="number"
                            value={settings.minimumEvidenceFiles}
                            onChange={(event) => updateSetting("minimumEvidenceFiles", Number(event.target.value))}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.enableNotifications}
                                    onChange={(_, checked) => updateSetting("enableNotifications", checked)}
                                />
                            }
                            label="Enable workflow notifications"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.allowFacultyEditAfterReturn}
                                    onChange={(_, checked) => updateSetting("allowFacultyEditAfterReturn", checked)}
                                />
                            }
                            label="Allow faculty edits after returned review"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            onClick={saveSettings}
                        >
                            Save Settings
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                variant="outlined"
                sx={{ p: 3, mt: 3 }}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{ alignItems: "center" }}
                >
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">
                            System Health
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            API
                        </Typography>
                        <Chip
                            label={apiHealth?.status ?? "Unavailable"}
                            color={apiHealth ? "success" : "error"}
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Database
                        </Typography>
                        <Chip
                            label={databaseHealth?.status ?? "Unavailable"}
                            color={databaseHealth ? "success" : "error"}
                            size="small"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            Pending Migrations
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                            {databaseHealth?.pendingMigrations.length ?? "-"}
                        </Typography>
                    </Grid>

                    {healthError && (
                        <Grid size={{ xs: 12 }}>
                            <Alert severity="warning">
                                {healthError}
                            </Alert>
                        </Grid>
                    )}

                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="outlined"
                            onClick={() => void loadHealth()}
                        >
                            Refresh Health
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar
                open={Boolean(message)}
                autoHideDuration={3000}
                onClose={() => setMessage(null)}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setMessage(null)}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;
