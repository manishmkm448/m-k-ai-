# M.K AI — Windows 11 Automated Setup & Installer
# Creator: Manish Meena
# Tagline: Your Intelligence. Your Control.

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  M.K AI — WINDOWS 11 SOVEREIGN ENVIRONMENT INSTALLER     " -ForegroundColor Cyan
Write-Host "  Creator: Manish Meena                                   " -ForegroundColor Cyan
Write-Host "  Tagline: Your Intelligence. Your Control.               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Python installation
Write-Host "`n[1/5] Verifying Python runtime..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pyVersion = python --version
    Write-Host "Found: $pyVersion" -ForegroundColor Green
} else {
    Write-Host "Python not found. Please install Python 3.10+ from python.org or Microsoft Store." -ForegroundColor Red
    exit 1
}

# 2. Check Flutter installation (Optional for desktop frontend build)
Write-Host "`n[2/5] Checking Flutter SDK..." -ForegroundColor Yellow
if (Get-Command flutter -ErrorAction SilentlyContinue) {
    Write-Host "Flutter SDK detected. Desktop Windows builds enabled." -ForegroundColor Green
} else {
    Write-Host "Flutter not in PATH. Web and Python backend will run standalone." -ForegroundColor Gray
}

# 3. Setup Virtual Environment
Write-Host "`n[3/5] Initializing Python Virtual Environment..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\backend"
if (-Not (Test-Path -Path "venv")) {
    python -m venv venv
    Write-Host "Virtual environment created at backend\venv" -ForegroundColor Green
}

# Activate & install dependencies
& ".\venv\Scripts\Activate.ps1"
pip install --upgrade pip
pip install -r requirements.txt
Write-Host "Dependencies successfully installed." -ForegroundColor Green

# 4. Check Ollama for Offline AI
Write-Host "`n[4/5] Checking Local Offline Ollama Engine..." -ForegroundColor Yellow
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "Ollama is installed locally. Offline AI is active." -ForegroundColor Green
} else {
    Write-Host "Ollama not detected. To use local offline AI on Windows, download from https://ollama.ai" -ForegroundColor Gray
}

# 5. Create Desktop Shortcut
Write-Host "`n[5/5] Creating Desktop Launcher..." -ForegroundColor Yellow
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$HOME\Desktop\M.K AI.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\..\backend\venv\Scripts\python.exe"
$Shortcut.Arguments = "-m uvicorn main:app --port 8000"
$Shortcut.WorkingDirectory = "$PSScriptRoot\..\backend"
$Shortcut.Description = "M.K AI — Sovereign Advanced Personal AI by Manish Meena"
$Shortcut.Save()

Write-Host "`nSetup complete! To start M.K AI on Windows 11:" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python main.py" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
