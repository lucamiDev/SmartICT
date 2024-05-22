//This is the query that collects data from InfluxDB
const userController = require('../userController');

const {InfluxDB, consoleLogger} = require('@influxdata/influxdb-client')


const logger = require('../../../logger/logger');

// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=='
const org = 'test'
const bucket = 'Calculated_matanks'
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
|> limit(n: 50)
`

var array = [];
// Get data line by line
// Get data line by line
exports.influx = (req, res) => {
  function influxQuery(){
    logger.info('imlController: 1) Before GET data for MatAnks calculations')
    // start of time
    // console.time("dbsave")
    return new Promise((resolve, reject) => {
        try{
            const fluxObserver = {
              next(row, tableMeta) {
                // console.log(array)

                const o = tableMeta.toObject(row)
                // console.log(o._value)
                array.push(o._value)
              },
              error(error) {
                console.error(error)
                console.log('\nFinished ERROR')
              },
              complete() {
                console.log('\nFinished getting data from INFLUXDB')
                //This part send values to python
                // https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f
                var dataToSend;
                  // spawn new child process to call the python script
                  //Use 'python' not 'python3'
                  // With this array we define which fucntion will be used 
                const python = spawn('python', [`${__dirname}/../../Model/iml.py`, "array", array]);
                
                // console.log(array)
                // collect data from script
                python.stdout.on('data', function (data) {
                  dataToSend = data.toString();
                });
          
                python.stderr.on('data', data => {
                  console.error(`stderr: ${data}`);
                });
          
                // in close event we are sure that stream from child process is closed
                python.on('exit', (code) => {
                // console.log(`child process exited with code ${code}, ${dataToSend}`);
                console.log(dataToSend)
                logger.info('imlController: 2) Calculated MatAnks')
                
                resolve(dataToSend)
                res.status(200)
              
                  
                //  This is sopose to be for response intersaption but we would need express server
                //  response.sendFile(`${__dirname}/public/result.html`);
                });
              }
            }
          
            /** Execute a query and receive line table metadata and rows. */
            queryApi.queryRows(fluxQuery, fluxObserver)  
            // end of time
            // console.timeEnd("dbsave")    
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
        const point = new Point('mem').floatField('matAnks', data)

        writeApi.writePoint(point)
        logger.info('imlController: 3) Data sent to INFLUXDB')
        writeApi.close().then(() => {
                console.log('FINISHED')
            }).catch(e => {
                console.error(e)
                console.log('Finished ERROR')
            })
        array= []
    }).catch(err => {
        console.log(err);
    }); 
    }

    // Interval timer that we activate with a button
    setInterval(function() { getData() }, 1000);
    
  


  // setInterval(getData(), 2000)
}

// function influx(req, res) {
  
  







