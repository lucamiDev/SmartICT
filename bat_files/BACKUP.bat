@echo off

REM cd "c:\matanks\setup\influx\influxdb2-2.0.9-windows-amd64"
REM start influxd


REM waitfor /t 3 pause
cd "C:\Users\Lucami_Sig\Documents\MatAnks\outside\InfluxData"
start influxd

waitfor /t 20 pause

cd "C:\Users\Lucami_Sig\Documents\MatAnks\outside\MatAnks\influx_backup"
python make_influx_bu.py

REM cd "C:\Users\Lucami_Sig\Documents\MatAnks\outside\MatAnks\influx_backup"
REM python backup_empatica.py

robocopy C:\Users\Lucami_Sig\Desktop\BU_DATA D:\matanks_buckup /E

taskkill /f /im influxd.exe
