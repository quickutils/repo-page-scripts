@echo off
setlocal enabledelayedexpansion

SET VERSION=%1
SET COMMIT_MESSAGE=%2
:latest
if "!VERSION!"=="" (
	SET VERSION=latest
)
SET SCRIPTS_DIR=%~dp0/docs/scripts/!VERSION!/
SET STYLES_DIR=%~dp0/docs/styles/!VERSION!/

if "!COMMIT_MESSAGE!"=="" (
	echo you need to provide a commit message for this deployment
	exit /b 0
)

REM GENERATE THE language-color.css content
extract_github_color.ps1 

IF NOT EXIST "!SCRIPTS_DIR!" ( MKDIR "!SCRIPTS_DIR!")
IF NOT EXIST "!STYLES_DIR!" ( MKDIR "!STYLES_DIR!")

robocopy %~dp0/scripts !SCRIPTS_DIR! /MIR
robocopy %~dp0/styles !STYLES_DIR! /MIR

if not "!VERSION!"=="latest" (
	SET VERSION=latest
	goto:latest
)

echo pushimg deploy: !COMMIT_MESSAGE!
git add .
git commit -m !COMMIT_MESSAGE!
git push origin master
