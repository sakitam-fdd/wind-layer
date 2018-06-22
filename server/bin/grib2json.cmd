@echo off
"%JAVA_HOME%\bin\java.exe" -Xmx512M -jar %~dp0\grib2json.jar %*
