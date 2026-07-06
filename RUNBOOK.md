# FPAMS Runbook

## Startup

1. Confirm SQL Server is available for the connection string in
   `Backend/FPAMS/FPAMS.API/appsettings.json`.

   Default development connection:

   ```text
   Server=localhost,1433;Database=FPAMS_DB;User Id=sa;Password=Fpams@12345;Encrypt=False;TrustServerCertificate=True
   ```

   Start the included SQL Server container with:

   ```bash
   docker compose up -d fpams-sql
   ```

   If your Docker installation does not include the `docker compose`
   subcommand, use plain Docker:

   ```bash
   docker pull mcr.microsoft.com/mssql/server:2022-latest
   docker run -d --name fpams-sql -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=Fpams@12345 -p 1433:1433 -v fpams-sql-data:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
   ```

   If your machine uses LocalDB instead, change the server to:

   ```text
   Server=(localdb)\MSSQLLocalDB;Database=FPAMS_DB;Trusted_Connection=True;Encrypt=False;TrustServerCertificate=True
   ```

   If SQL Server is not configured yet and you only need to start the API
   shell for diagnostics, set `Database:ApplyMigrationsOnStartup` to `false`.
   App features that read/write data require a working SQL Server connection.

   If your machine already has SQL Server with Windows auth enabled, use:

   ```text
   Server=localhost;Database=FPAMS_DB;Trusted_Connection=True;Encrypt=False;TrustServerCertificate=True
   ```
2. Start the backend API:

   ```bash
   cd Backend/FPAMS
   dotnet run --project FPAMS.API
   ```

   In Visual Studio, use the `http` profile for the smoothest Swagger launch:
   `http://localhost:5266/swagger`. The `https` profile also binds HTTPS, but
   local machines may need `dotnet dev-certs https --trust` before browsers
   trust `https://localhost:7095`.

3. Start the frontend:

   ```bash
   cd Frontend/fpams-web
   npm run dev
   ```

The API applies EF Core migrations on startup and seeds core roles, master data,
one admin user, and one demo faculty profile.

If startup fails with `Failed to generate SSPI context`, your SQL Server
Windows authentication setup is not usable from the current user session.
Use LocalDB or configure SQL Server authentication and update the connection
string accordingly.

## Seed Logins

- Admin: `admin@fpams.com` / `Admin@123`
- Faculty demo: `faculty.cse@fpams.com` / `Faculty@123`
- HOD demo: `hod.cse@fpams.com` / `Hod@123`
- Principal demo: `principal@fpams.com` / `Principal@123`
- APEC demo: `apec@fpams.com` / `Apec@123`

## Full Workflow QA

1. Log in as admin.
2. Confirm Users, Departments, Designations, Academic Years, and Faculty
   Management show seeded records.
3. Open Faculty Appraisal and create an appraisal for `FAC001`.
4. Upload evidence from the appraisal row.
5. Submit the appraisal.
6. Open HOD Review and approve or return the submitted appraisal.
7. Open Principal Review and approve HOD-reviewed appraisals.
8. Open IQAC/APEC Review and finalize Principal-reviewed appraisals.
9. Open Notifications and confirm workflow notifications were created.
10. Open Reports, confirm dashboard-style summaries, export CSV, and use
    Print / PDF for a printable report.

## Health Checks

- API health: `GET /api/Health`
- Database health: `GET /api/Health/database`

## Build Verification

```bash
cd Backend/FPAMS
dotnet build FPAMS.slnx
dotnet test FPAMS.slnx

cd ../../Frontend/fpams-web
npm run build
```

Or run the combined verifier from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1
```

If packages are already restored and your shell cannot read the user NuGet
configuration, use:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1 -NoRestore
```

When SQL Server is available, run the final runtime proof with migrations and
database health enabled:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1 -DatabaseSmoke
```

`-DatabaseSmoke` also verifies the seeded admin login and protected admin
endpoints for Users, Departments, and Roles. Override credentials when needed:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1 -DatabaseSmoke -AdminEmail admin@fpams.com -AdminPassword Admin@123
```

For an API host-only smoke test without touching the database:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1 -ApiSmoke
```
