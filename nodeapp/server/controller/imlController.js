require('dotenv').config();
const userController = require('./userController');
const {InfluxDB, Point, consoleLogger} = require('@influxdata/influxdb-client')
const {PythonShell} = require('python-shell');


// const logger = require('../../logger/logger');

// Saved value of a unique_id
const begin = require('./userController');
const unique_id = begin.unique_id;

// You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=='
const token = process.env.API_KEY;
const org = process.env.ORG_NAME;


const bucket = 'Calculated_matanks'

const client = new InfluxDB({url: 'http://localhost:8086', token: token})

const queryApi = client.getQueryApi(org)

//VAriables that we need to send dat ato py
const bodyParser = require("body-parser");



// Take last 10 values
const fluxQuery = `from(bucket: "test2") |> range(start: -1h) |> filter(fn: (r) => r["_measurement"] == "my_measurement")
|> filter(fn: (r) => r["_field"] == "v1" or r["_field"] == "v2")
|> filter(fn: (r) => r["data"] == "ANKS2")
|> sort(columns: ["_time", "_value"])
|> limit(n: 50)
`

let array = [];
exports.influx = (req, res) => {
  function influxQuery() {
    logger.info('imlController: 1) Before GET data for MatAnks calculations')
    
    return new Promise((resolve, reject) => {
      try {
        const fluxObserver = {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row)
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
            const options = {
              scriptPath: `${__dirname}/../../Model/`,
              args: ['array', array]
            };
            PythonShell.run('iml.py', options, function (err, dataToSend) {
              if (err) {
               
                console.error('PythonShell error:', err);
                reject(err);
              } else {
                console.log("This is data to send: ", dataToSend);
                logger.info('imlController: 2) Calculated MatAnks')
                resolve(dataToSend[0]);
                res.status(200);

                const point = new Point('mem').floatField('matAnks', dataToSend[0])
                const writeApi = client.getWriteApi(org, bucket)
                // writeApi.useDefaultTags({host: 'host1'})
                writeApi.writePoint(point)
                logger.info('imlController: 3) Data sent to INFLUXDB')
                writeApi.close().then(() => {
                  console.log('FINISHED')
                }).catch(e => {
                  console.error(e)
                  console.log('Finished ERROR')
                })
                array = []
              }
            });
          }
        }
        /** Execute a query and receive line table metadata and rows. */
        queryApi.queryRows(fluxQuery, fluxObserver);
      } catch (err) {
        reject(err);
      }
    });
  }
  
  // Define a loop that runs influxQuery every minute
  // setInterval(() => {influxQuery()}, 1000);
}
