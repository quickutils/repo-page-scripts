@echo off
setlocal enabledelayedexpansion

SET VERSION=%1
if "!VERSION!"=="" (
	SET VERSION=latest
)
SET SCRIPTS_DIR=%~dp0/docs/scripts/!VERSION!/
SET STYLES_DIR=%~dp0/docs/styles/!VERSION!/

IF NOT EXIST "!SCRIPTS_DIR!" ( MKDIR "!SCRIPTS_DIR!")
IF NOT EXIST "!STYLES_DIR!" ( MKDIR "!STYLES_DIR!")

robocopy %~dp0/scripts !SCRIPTS_DIR! /MIR
robocopy %~dp0/styles !STYLES_DIR! /MIR