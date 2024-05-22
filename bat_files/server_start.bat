@echo off

cd C:\MatAnks\setup\Influx\influxdb2-2.0.9-windows-amd64
start influxd

waitfor /t 2 pause

cd c:\xampp
start apache\bin\httpd.exe

waitfor /t 5 pause

start mysql\bin\mysqld.exe

REM waitfor /t 3 pause

REM cd C:\MatAnks\nodeapp
REM start cmd /k node app.js

REM waitfor /t 2 pause
REM rem set chrome_exe = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs"
REM REM start -fullscreen http://localhost:3001
REM rem %chrome_exe% --start-fullscreen --app=https://www.netflix.com
REM REM C:\Program Files\Google\Chrome\Application

REM start "" "C:\Users\Lucami\Desktop\MatAnks.lnk" 

rem --incognito --disable-pinch --no-user-gesture-required --overscroll-history-navigation=0


REM start javascript: "window.open('http://localhost:3001/', '_blank', 'fullscreen=yes, scrollbars=auto');void(0);"
REM start "" /wait "C:\Users\jeans\OneDrive\Namizje\matAnks\MatAnksKill.bat"