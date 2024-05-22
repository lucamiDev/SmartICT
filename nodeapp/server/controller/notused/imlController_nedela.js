

//This is the query that collects data from InfluxDB
const userController = require('../userController');


// Python lib
const {PythonShell} = require('python-shell');
let pyshell = new PythonShell(`${__dirname}/../../Model/iml.py`);

const {InfluxDB, consoleLogger} = require('@influxdata/influxdb-client')


const logger = require('../../../logger/logger');

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=='
const org = 'test'
const bucket = 'test2'
const client = new InfluxDB({url: 'http://localhost:8086', token: token})
// write influxdb data
const {Point} = require('@influxdata/influxdb-client')



const queryApi = client.getQueryApi(org)


//VAriables that we need to send dat ato py
const bodyParser = require("body-parser");
const {spawn} = require('child_process');
// const devLogger = require('../../logger/logger');


// Take last 10 values
const fluxQuery = `from(bucket: "test2") |> range(start: -1h) |> filter(fn: (r) => r["_measurement"] == "my_measurement")
|> filter(fn: (r) => r["_field"] == "v1" or r["_field"] == "v2")
|> filter(fn: (r) => r["data"] == "ANKS2")
|> sort(columns: ["_time", "_value"])
|> limit(n: 10)
`

var array = [];
// Get data line by line
// Get data line by line
exports.influx = (req, res) => {
  function influxQuery(){
    logger.info('imlController: 1) Before GET data ')
    // start of time
    // console.time("dbsave")
    return new Promise((resolve, reject) => {
        try{
            const fluxObserver = {
              next(row, tableMeta) {
                const o = tableMeta.toObject(row)
                // console.log(o._value)
                array.push(o._value)
                
              },
              error(error) {
                console.error(error)
                console.log('\nFinished ERROR')
              },
              complete() {
                logger.info('imlController:')
                
                
                pyshell.send(array);

                pyshell.on('message', function (message) {
                    logger.info('imlController: TUKAJ')
                    // received a message sent from the Python script (a simple "print" statement)
                    console.log("message", message);
                  });

                // Catch errors
                pyshell.end(function (err,code,signal) {
                    
                    if (err) throw err;
                    console.log('The exit code was: ' + code);
                    console.log('The exit signal was: ' + signal);
                    console.log('finished');
                  });
                  
                //  This is sopose to be for response intersaption but we would need express server
                //  response.sendFile(`${__dirname}/public/result.html`);
                }
              }
              queryApi.queryRows(fluxQuery, fluxObserver)  
            
      } catch (err) {
            reject(err);
      }
        
      })
    }

// We need this to get rthe async fucntions values
function getData (){
    let myPromise = influxQuery();
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({host: 'host1'})
    myPromise.then(data => {
        console.log("Parsed data :", data);

        // Write data to influxDB
        const point = new Point('mem').floatField('matAnks', data)
        writeApi.writePoint(point)
        logger.info('imlController: 3) Data sent to INFLUXDB')
        writeApi.close().then(() => {
                console.log('FINISHED')
            }).catch(e => {
                console.error(e)
                console.log('Finished ERROR')
            })
    }).catch(err => {
        console.log(err);
    }); 
    }

    // Interval timer that we activate with a button
setInterval(function() { getData() }, 2000);
    
}


  // setInterval(getData(), 2000)


// function influx(req, res) {
  
  







