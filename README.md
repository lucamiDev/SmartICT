# Math_Anks_System


Nodeapp contains all the code required to run the application
bat_files containt all the Command files to startup the application


ENVRIONMENT:

1) INFLUX DB:

 1) Download Influx DB from the offical website as per instructions on the website.
 2) Start the server in a seprate terminal.
 3) Visit localhost:8086 in one of the browsers
 4) Create a profile and initial organization name (hardcoded in the program: org - Lucami_Dev, bucket - Lucami_Bucket)
 5) Make sure to save the API key and save it somewhere safe - this is also hardcoded but will be changed in the future 18.5.2024)
 6) Click Quick Start at the begining of the process



2) GRAFANA:

 1) Download Grafana from the offical website as per instructions on the website.
 2) Start the server in a seprate terminal.
 3) Visit localhost:3000 in one of the browsers.
 4) Default credentails are Usr: admin Pass: admin. You will be asked to set a new password



3) Connect InfluxDB with Grafana:

 Grafana: settings --> Administration --> Plugins and data --> Plugins --> InfluxDB (Add new data source) --> 
	Name: influxDB_flux
	Query Language: Flux
	#URL: http://localhost:8086/
	Timeout: 997 
	Auth: With Credentials --> On; Basic Auth --> Off
	Oragnization: Lucami_Dev
	Token: Eneter the token you recived during InfluxDB setup
	Default Bucket: Lucami_Bucket


 Create a new Dashboard:

Create 5 seprate grafs by entering the flux query to the filed:

Camera:
from(bucket: "grafana")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "camera")
  |> group(columns: ["_measurement"])
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> yield(name: "mean")

Phase:
from(bucket: "grafana")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "button")
  |> filter(fn: (r) => r["_field"] == "state")
  |> group(columns: ["type"])
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> yield(name: "mean")

Emotion:
from(bucket: "grafana")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "button")
  |> filter(fn: (r) => r["_field"] == "emotion")
  |> group(columns: ["_measurement"])
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> yield(name: "mean")


Tobii:
from(bucket: "grafana")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "tobii")
  |> group(columns: ["lgotx"])
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> yield(name: "mean")



3) XAMPP:
 1) Dawnload XAMPP
 2) Start MySql 
 3) Import database
