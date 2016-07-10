rem Create a database & fill it with initial data

@echo off

if not defined UB_HOME (
  SET UB_HOME=C:\UnityBase
  echo UB_HOME is not defined. Set default UB_HOME=%UB_HOME%
)

if not defined DBA (
  SET DBA=none
)

if not defined DBA_PWD (
  SET DBA_PWD=none
)

SET TESTCASE=init database
if not defined UB_CFG (
  SET UB_CFG=ubConfig.json
  A default config %UB_CFG% will be used
)

SET UB_DEV=true

call %UB_HOME%\bin\ub cmd/initDB -host http://localhost:888 -cfg %UB_CFG% -dba %DBA% -dbaPwd %DBA_PWD% -u admin -p admin -drop -create
if errorlevel 1 goto err

SET TESTCASE=generateDDL
call %UB_HOME%\bin\ub cmd/generateDDL -host http://localhost:888 -cfg %UB_CFG% -u admin -p admin -autorun
if errorlevel 1 goto err

SET TESTCASE=initialize
call %UB_HOME%\bin\ub cmd/initialize -cfg %UB_CFG% -u admin -p admin -host http://localhost:888 
if errorlevel 1 goto err

goto :eof

:err
@echo Testcase %TESTCASE% fail
EXIT 1

:eof
echo Application is ready 
