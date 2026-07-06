param(
    [switch]$SkipFrontend,
    [switch]$NoRestore,
    [switch]$ApiSmoke,
    [switch]$DatabaseSmoke,
    [string]$ApiUrl = "http://localhost:5266",
    [string]$AdminEmail = "admin@fpams.com",
    [string]$AdminPassword = "Admin@123",
    [int]$StartupTimeoutSeconds = 45
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$backend = Join-Path $root "Backend\FPAMS"
$frontend = Join-Path $root "Frontend\fpams-web"

function Invoke-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )

    Write-Host ""
    Write-Host "== $Name ==" -ForegroundColor Cyan
    & $Action
}

function Invoke-Native {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Command
    )

    & $Command[0] $Command[1..($Command.Length - 1)]

    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $($Command -join ' ')"
    }
}

function Start-ApiProcess {
    param(
        [bool]$ApplyMigrations
    )

    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = "dotnet"
    $psi.Arguments = "run --project FPAMS.API --no-build --urls $ApiUrl"
    $psi.WorkingDirectory = $backend
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $true

    # Windows can expose both Path and PATH to child processes in some shells.
    # Normalizing avoids a duplicate-key failure when launching dotnet.
    foreach ($key in @($psi.Environment.Keys)) {
        if ($key -ceq "PATH") {
            [void]$psi.Environment.Remove($key)
        }
    }

    $psi.Environment["Database__ApplyMigrationsOnStartup"] = $ApplyMigrations.ToString().ToLowerInvariant()

    $process = [System.Diagnostics.Process]::Start($psi)

    return [PSCustomObject]@{
        Process = $process
        OutputTask = $process.StandardOutput.ReadToEndAsync()
        ErrorTask = $process.StandardError.ReadToEndAsync()
    }
}

function Stop-ApiProcess {
    param($Handle)

    if ($null -eq $Handle) {
        return
    }

    if (-not $Handle.Process.HasExited) {
        $Handle.Process.Kill()
    }

    $Handle.Process.WaitForExit()
}

function Wait-ForHealth {
    param(
        [string]$Url
    )

    $deadline = (Get-Date).AddSeconds($StartupTimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        try {
            return Invoke-RestMethod -Uri $Url -TimeoutSec 3
        }
        catch {
            Start-Sleep -Seconds 1
        }
    }

    throw "Timed out waiting for $Url"
}

function Invoke-JsonPost {
    param(
        [string]$Url,
        [object]$Body
    )

    return Invoke-RestMethod `
        -Uri $Url `
        -Method Post `
        -ContentType "application/json" `
        -Body ($Body | ConvertTo-Json -Compress) `
        -TimeoutSec 10
}

function Invoke-AuthenticatedGet {
    param(
        [string]$Url,
        [string]$Token
    )

    return Invoke-RestMethod `
        -Uri $Url `
        -Headers @{ Authorization = "Bearer $Token" } `
        -TimeoutSec 10
}

Invoke-Step "Backend build" {
    Push-Location $backend
    try {
        if ($NoRestore) {
            Invoke-Native dotnet build FPAMS.slnx --no-restore
        }
        else {
            Invoke-Native dotnet build FPAMS.slnx
        }
    }
    finally {
        Pop-Location
    }
}

Invoke-Step "Backend tests" {
    Push-Location $backend
    try {
        Invoke-Native dotnet test FPAMS.slnx --no-build
    }
    finally {
        Pop-Location
    }
}

if (-not $SkipFrontend) {
    Invoke-Step "Frontend build" {
        Push-Location $frontend
        try {
            Invoke-Native npm run build
        }
        finally {
            Pop-Location
        }
    }
}

if ($ApiSmoke -or $DatabaseSmoke) {
    $handle = $null
    Invoke-Step "API smoke" {
        $handle = Start-ApiProcess -ApplyMigrations:$DatabaseSmoke

        try {
            $health = Wait-ForHealth -Url "$ApiUrl/api/Health"
            Write-Host ($health | ConvertTo-Json -Compress)

            if ($DatabaseSmoke) {
                $databaseHealth = Wait-ForHealth -Url "$ApiUrl/api/Health/database"
                Write-Host ($databaseHealth | ConvertTo-Json -Compress)

                $login = Invoke-JsonPost `
                    -Url "$ApiUrl/api/Auth/login" `
                    -Body @{
                        email = $AdminEmail
                        password = $AdminPassword
                    }

                if (-not $login.success -or [string]::IsNullOrWhiteSpace($login.token)) {
                    throw "Seeded admin login failed for $AdminEmail"
                }

                Write-Host "Seeded admin login succeeded for $($login.email) as $($login.role)."

                $users = Invoke-AuthenticatedGet -Url "$ApiUrl/api/User" -Token $login.token
                $departments = Invoke-AuthenticatedGet -Url "$ApiUrl/api/Department" -Token $login.token
                $roles = Invoke-AuthenticatedGet -Url "$ApiUrl/api/Role" -Token $login.token

                if ($users.Count -lt 1) {
                    throw "Protected user endpoint returned no seeded users."
                }

                if ($departments.Count -lt 1) {
                    throw "Protected department endpoint returned no seeded departments."
                }

                if ($roles.Count -lt 1) {
                    throw "Protected role endpoint returned no seeded roles."
                }

                Write-Host "Protected admin endpoints returned users=$($users.Count), departments=$($departments.Count), roles=$($roles.Count)."
            }
        }
        catch {
            Stop-ApiProcess -Handle $handle

            Write-Host ""
            Write-Host "API stdout:" -ForegroundColor Yellow
            Write-Host $handle.OutputTask.Result
            Write-Host ""
            Write-Host "API stderr:" -ForegroundColor Yellow
            Write-Host $handle.ErrorTask.Result

            throw
        }
        finally {
            Stop-ApiProcess -Handle $handle
        }
    }
}

Write-Host ""
Write-Host "FPAMS verification completed successfully." -ForegroundColor Green
