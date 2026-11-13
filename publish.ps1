# publish.ps1
# Automates global dependency verification, winget installation if missing, and builds the Bible app.

[CmdletBinding()]
param(
    [switch]$SkipInstall,
    [string]$DistPath = "dist"
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " ScriptureFlow - Publish & Build Script  " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

function Test-CommandExists {
    param([string]$Command)
    $exists = Get-Command $Command -ErrorAction SilentlyContinue
    return ($null -ne $exists)
}

function Install-WithWinget {
    param(
        [string]$PackageId,
        [string]$Name
    )
    Write-Host "[!] Missing dependency: $Name" -ForegroundColor Yellow
    if (-not (Test-CommandExists "winget")) {
        Write-Error "winget is not found on this system. Please install winget or install $Name manually."
        exit 1
    }

    Write-Host "[*] Attempting to install $Name ($PackageId) using winget..." -ForegroundColor Cyan
    try {
        & winget install --id $PackageId --exact --accept-package-agreements --accept-source-agreements --silent
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "winget returned exit code $LASTEXITCODE. Retrying in non-silent mode..."
            & winget install --id $PackageId --exact --accept-package-agreements --accept-source-agreements
        }
        Write-Host "[+] Successfully installed $Name. Refreshing environment..." -ForegroundColor Green
        # Refresh Path environment variable in current session
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    }
    catch {
        Write-Error "Failed to install $Name with winget: $_"
        exit 1
    }
}

# ----------------------------------------------------
# 1. Check Global Dependencies
# ----------------------------------------------------
Write-Host "[1/3] Checking global dependencies..." -ForegroundColor Green

# Check Node.js / npm
if (-not (Test-CommandExists "node")) {
    Install-WithWinget -PackageId "OpenJS.NodeJS.LTS" -Name "Node.js"
} else {
    $nodeVersion = node -v
    Write-Host "  - Node.js is installed ($nodeVersion)" -ForegroundColor Gray
}

if (-not (Test-CommandExists "npm")) {
    Install-WithWinget -PackageId "OpenJS.NodeJS.LTS" -Name "npm"
} else {
    $npmVersion = npm -v
    Write-Host "  - npm is installed ($npmVersion)" -ForegroundColor Gray
}

# Check Git (useful for submodules / publishing)
if (-not (Test-CommandExists "git")) {
    Write-Host "  - Git is not detected, installing via winget..." -ForegroundColor Yellow
    Install-WithWinget -PackageId "Git.Git" -Name "Git"
} else {
    Write-Host "  - Git is installed" -ForegroundColor Gray
}

Write-Host "  All required global dependencies verified." -ForegroundColor Green
Write-Host ""

# ----------------------------------------------------
# 2. Check & Install Local Project Dependencies
# ----------------------------------------------------
Write-Host "[2/3] Checking project local dependencies..." -ForegroundColor Green
if (-not (Test-Path "node_modules") -or -not (Test-Path "package-lock.json")) {
    Write-Host "  - Installing node_modules via npm install..." -ForegroundColor Cyan
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install failed."
        exit 1
    }
} else {
    Write-Host "  - node_modules already present." -ForegroundColor Gray
}
Write-Host ""

# ----------------------------------------------------
# 3. Build Project
# ----------------------------------------------------
Write-Host "[3/3] Building production bundle..." -ForegroundColor Green

& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Project build failed."
    exit 1
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Build Succeeded! Production ready in ./$DistPath" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To preview the production build locally, run:" -ForegroundColor Cyan
Write-Host "  npm run preview" -ForegroundColor Yellow
Write-Host ""

