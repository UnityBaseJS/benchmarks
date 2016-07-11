# UnityBase Benchmarking Test

Benchmarks for UnityBase for a scenarios from the [TechEmpower Web Framework Benchmarks](https://www.techempower.com/benchmarks/).

# Running the benchmarks

The benchmark repo is set up to work against the latest UnityBase version so make sure you read through the following details to help you get started.

## The scenarios
Following are the details of each of the scenarios the server application contains implementations for and thus can be benchmarked:

| url | Name | Description |
| :--- | :--- | :--- |
| /plaintext | Plaintext | This test is an exercise of the request-routing fundamentals only, designed to demonstrate the capacity of high-performance platforms in particular. Requests will be sent using HTTP pipelining. |
| /json | JSON | This test exercises the framework fundamentals including keep-alive support, request routing, request header parsing, object instantiation, JSON serialization, response header generation, and request count throughput. |
| /dbRaw | Single Query Raw | This test exercises the framework's random number generator, database driver, and database connection pool. |
| /db | Single Query ORM | As for the single query raw test above but using UBQL as the ORM. |
| /queriesRaw?queries=20 | Multiple Queries Raw | Multiple rows are fetched to more dramatically punish the database driver and connection pool. |
| /queries?queries=20 | Multiple Queries ORM | As for the multiple query raw test above but using UBQL as the ORM. |
| /fortunesRaw | Fortunes Raw | This test exercises the database connectivity, dynamic-size collections, sorting, server-side templates, XSS countermeasures, and character encoding. |
| /fortunes | Fortunes ORM | As for the Fortunes raw test above but using UBQL as the ORM. |

## Setting up the UnityBase
Download and install the latest UnityBase Standart Edition setup from https://unitybase.info/downloads/UnityBaseSetup.exe (15Mb)

If you have a PowerShell you can do this by typing:

	mkdir ubapps && cd ./ubapps
	powershell -Command Invoke-WebRequest -OutFile UnityBaseSetup.exe https://unitybase.info/downloads/UnityBaseSetup.exe
	UnityBaseSetup.exe

This commands will download the setup and install the UnityBase.
Setup will:

 - unpack the UnityBase files to the c:\UnityBase
 - install a [Microsoft Visual C++ 2010 Runtime Library](https://en.wikipedia.org/wiki/Microsoft_Windows_library_files#MSVCRT.DLL.2C_MSVCPP.DLL_and_CRTDLL.DLL) if it is not installed yet
 - set a environment variable UB_HOME=c:\UnityBase
 - add a c:\UnityBase\bin to the PATH environment variable

## Verify installation

If you just install a UnityBase - restart a cmd.exe (necessery for re-read a environment variables setup add).

	ub -e "console.log('It is work!')"

This command evaluate a JavaScript and output to console `It is work!`.


## Setting up the application

Clone this repo and execute a `prepare.cmd`. This command will:

- create a empty SQLite3 database
- create a tables for a application domain
- fill tables with data necessery for tests

You can do it from a command line as such:
 
	cd ubapps
	
If you have a git installed:

	git clone https://github.com/UnityBaseJS/benchmarks.git

If you have a powershell:

	powershell -Command Invoke-WebRequest -OutFile benchmarks.zip https://github.com/UnityBaseJS/benchmarks/archive/master.zip
	powershell -Command Expand-Archive benchmarks.zip t
	move .\t\benchmarks-master .\benchmarks
	rmdir .\t

Prepare the test suite

	cd benchmarks
	.\prepare.cmd

And run an application

	.\run.cmd

## Generating Load
It's best to generate load from a completely separate machine from the server if you can, to avoid resource contention during the test.

Techempower use the [wrk](https://github.com/wg/wrk) load generation tool to generate the load for our benchmark runs. 
It's the best tool we've found for the job and supports HTTP pipelining (used by the plaintext scenario) via its scripting interface. 

Wrk will only run from a Linux machine however, so if you must use Windows, we recomment a [Go boom](https://github.com/rakyll/boom).
If you have a Go you can compile it, if not - you can [dowload Go Boom for Windows from our site](https://unitybase.info/downloads/boom.exe)

You can also try using [ab](https://httpd.apache.org/docs/2.2/programs/ab.html) (Apache Bench). 
You can [dowload ab for Windows from here](http://download.nextag.com/apache/httpd/binaries/win32/#down). 
`ab` if faster compared to the `boom`, but on Wondows can benchmark only the `localhost` URLs.

Here's a sample `ab` command to generate load for the dbRaw scenario. This run is using 32 concurrent connections and perform a 10000 keep-alive requests.

	ab -c 32 -n 10000 -k http://localhost:888/dbRaw
	
## Environment
We're using the following physical machine to perform these tests:

 - Core i7-3370 @4.40GHz  8Gb RAM (app server & database & load generator on the same machine)
 - Xeon E3-1230 @3.3GHz   8Gb RAM (app server & database & load generator on the same machine)

## Results
`ab` do not increase the load if threads > 32, so we stop on 32 concurrent thread. 

Numbers in the table show the Requests Per Second handled by server.

For a Xeon E3 

| url | 8thread | 16 thread | 32 thread |
| :--- | ---: | ---: | ---: |
| /dbRaw | 29,142 | 36,524 | 37,895 |
| /db    |  8,100 |  9,780 |  10,041 |

For a Core i7:

| url | 8thread | 16 thread | 32 thread |
| :--- | ---: | ---: | ---: |
| /dbRaw | 15,130 | 17,800 | 17,700 |
| /db    |  3,550 |  3,740 |  4,475 |
| /fortunesRaw | 11,742 | 13,616 |  13,195 |
| /fortunes | 4,383 | 5,663 |  5,550 |
| /queriesRaw?queries=20 | 1,479 | 1,508 |  1,680 |
| /queries?queries=20 | 302 | 320 |  338 |

Observations - for a Core i7 `ab` take a 100% of one CPU (it can use a singe-cpu only)


You can compare results with the [.NET Core tests](https://github.com/aspnet/benchmarks) - [here is the .Net Core results spreadsheet](https://github.com/aspnet/benchmarks/blob/master/results/Results.xlsx)

UnityBase x1.5 times faster even on the Xeon E3 + `ab` (.Net Core test results are shown for 3 x Xeon E5 computers)

## More than benchmark
In fact, we got not just a test, but the complete application. 
During of `prepare.cmd` execution UnityBase take a config `ubConfig.json` [JSON schema of config](https://unitybase.info/models/UB/docson/index.html#../schemas/ubConfig.schema.json)
and:

 - create a empty database using [cmd/initDB command](https://unitybase.info/api/serverNew/module-cmd_initDB.html)
 - analyse the [application domain](https://unitybase.info/docs/design.html#Models) and generate a database tables using [cmd/generateDDL](https://unitybase.info/api/serverNew/module-cmd_generateDDL.html) command
 - fill the initial data for each model, included in the domain using [cmd/initialize](https://unitybase.info/api/serverNew/module-cmd_initialize.html) command

### User interface
There is a `adminUI` - a Single Page Rich Internet Application.

![adminUI interface sample](https://github.com/UnityBaseJS/benchmarks/raw/master/img/adminUI.png)

If you already execute a `prapare.cmd` - start a UB in a developer mode with logging enabled by typing

    ub -dev -cfg ubConfigWLog.json

This command will start a UnityBase Application server in a singe thread GUI mode with JavaScript debugger & logging.
Select `Service -> Run in browser` from a menu and explore a `adminUI` application (Google Chrome required). Use user name `admin` and password `admin`.

Everything you will see in the `adminUI` is either generated based on the entity definitions, or customizable directly from the `adminUI`.

### Debugging
You can debug a server-side JavaScript in the GUI - select a server thread from the ThreadID combo, in the `Source` tab search for the `methods.js`.
Double click to see the sources. Set a breakpoint inside the `function db`, run a db method from a browser `http://localhost:888/db` and debug a method.

### Security
For a testing purpose all security are disabled for a techempower endpoints, but all other endpoint are secure - see [this page for details](https://unitybase.info/api/serverNew/tutorial-security.html)

### Database support
For a simplicity techempower tests executed using build-in SQLite3 database. But you can use PostgreSQL, Oracle or MS SQL.
Modify a connections section of a config (ubConfig**YourDatabase**.json) file for database you need and ron (sample for a Postgres):

        set UB_CFG=ubConfigPostgre.json
        set DBA=postgres
        set DBA_PWD=postgres
        prepare.cmd
        ub -cfg ubConfigPostgre.json

See a description of config in the [JSON schema of config].


[JSON schema of config]: https://unitybase.info/models/UB/docson/index.html#../schemas/ubConfig.schema.json