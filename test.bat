@echo off
rem Runs the GovReady tests on Windows. Double-click this file, or run it from a terminal.
rem macOS and Linux users: run "sh test.sh" instead. Both call scripts\run-tests.js.
cd /d "%~dp0"
title GovReady - Test Runner

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js was not found.
  echo   Install it from https://nodejs.org and run this file again.
  echo.
  set "CODE=1"
  goto :done
)

node scripts\run-tests.js
set "CODE=%errorlevel%"

:done
if /i not "%~1"=="nopause" (
  echo  Press any key to close...
  pause >nul
)
exit /b %CODE%
