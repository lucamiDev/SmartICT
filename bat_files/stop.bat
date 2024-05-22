@echo off
taskkill /f /fi "WINDOWTITLE eq Node.js"
taskkill /f /im influxd.exe
taskkill /f /im httpd.exe
taskkill /f /im mysqld.exe
taskkill /f /im msedge.exe
taskkill /f /im chrome.exe

rem terminate cmd
rem for /F "tokens=2 delims=," %%G in ('tasklist /FI "WINDOEWTITLE eq %
exit