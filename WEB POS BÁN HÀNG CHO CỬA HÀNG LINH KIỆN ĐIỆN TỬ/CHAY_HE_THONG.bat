@echo off
chcp 65001 >nul
title TECHNO POS - KHOI DONG HE THONG
echo ========================================================
echo   DANG KHOI DONG HE THONG BAN HANG TECHNO POS...
echo ========================================================

cd /d "%~dp0"

:: Kiem tra xem Node.js da cai chua
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] May tinh nay chua cai dat Node.js!
    pause
    exit /b
)

:: Chay backend server ngam
start "TechnoPOS Server" /min cmd /c "node server.js"

echo [OK] Server dang chay ngam tai http://localhost:3000
echo [OK] Dang mo trang dang nhap...

timeout /t 2 >nul

:: Tu dong mo trinh duyet
start http://localhost:3000/04_Phan_He_Login_Xac_Thuc/login.html

exit
