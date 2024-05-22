@echo off

cd "C:\Users\Lucami_Sig\Documents\MatAnks\outside\InfluxData"
start influxd

waitfor /t 2 pause
REM rem cd "C:\MatAnks\setup\Clock"
REM cd "%ProgramFiles%\Coolkidsclock\Clock\"
REM powershell.exe -executionpolicy remotesigned -file "%ProgramFiles%\Coolkidsclock\Clock\clock.ps1"
REM waitfor /t 2 pause

cd "c:\xampp"
start apache\bin\httpd.exe

waitfor /t 5 pause

start mysql\bin\mysqld.exe

waitfor /t 3 pause

cd "C:\Users\Lucami_Sig\Documents\MatAnks\outside\MatAnks\new\nodeapp"
start cmd /k node app.js



start "" "C:\Users\Lucami_Sig\Desktop\MatAnks.lnk" 

