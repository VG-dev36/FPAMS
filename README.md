# FPAMS - Faculty Performance Appraisal Management System

## Overview

FPAMS is a web-based Faculty Performance Appraisal Management System for
Engineering Colleges.

## Technology Stack

### Backend

-   ASP.NET Core
-   Entity Framework Core
-   SQL Server
-   JWT Authentication
-   Clean Architecture

### Frontend

-   React 19
-   Vite
-   TypeScript
-   Material UI
-   Axios
-   React Router
-   Redux Toolkit

## Repository Structure

``` text
Backend/
Frontend/fpams-web/
Documents/
Database/
```

## Getting Started

### Backend

1.  Start SQL Server with `docker compose up -d fpams-sql`, or configure
    `Backend/FPAMS/FPAMS.API/appsettings.json` for your SQL Server instance.
2.  Run the API from `Backend/FPAMS` with `dotnet run --project FPAMS.API`.
3.  The API applies EF Core migrations and seeds demo users on startup.

### Frontend

``` bash
cd Frontend/fpams-web
npm install
npm run dev
```

## Current Modules

-   JWT authentication and role-protected navigation
-   Department, designation, academic year, role lookup, and user management
-   Faculty profile management
-   Faculty appraisal creation, scoring, evidence upload, and submission
-   HOD, Principal, and IQAC/APEC review workflow
-   Notifications
-   Dashboard and reports with CSV export and printable view
-   Settings and API/database health checks

See `RUNBOOK.md` for seeded credentials and the full workflow QA path.

## Verification

From the repository root:

``` powershell
powershell -ExecutionPolicy Bypass -File scripts/Verify-FPAMS.ps1
```

Use `-DatabaseSmoke` on a machine with SQL Server available to prove migrations,
seed data startup, API health, database health, seeded admin login, and
protected admin endpoints.
