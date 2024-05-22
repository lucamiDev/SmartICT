//This is the query that collects data from InfluxDB

const {InfluxDB, consoleLogger} = require('@influxdata/influxdb-client')


// You can generate an API token from the "API Tokens Tab" in the UI
const token = 'vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=='
const org = 'test'
const bucket = 'test2'

const client = new InfluxDB({url: 'http://localhost:8086', token: token})


const queryApi = client.getQueryApi(org)


// Take last 10 values
const fluxQuery = `from(bucket: "test2") |> range(start: -1h) |> filter(fn: (r) => r["_measurement"] == "my_measurement")
|> filter(fn: (r) => r["_field"] == "v1" or r["_field"] == "v2")
|> filter(fn: (r) => r["data"] == "ANKS2")
|> sort(columns: ["_time", "_value"])
|> limit(n: 10)
`

// Get data line by line
exports.influx = (req, res) => {
    
    const fluxObserver = {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        // console.log(o._value)
        
    },
    error(error) {
        console.error(error)
        console.log('\nFinished ERROR')
    },
    complete() {
        console.log('\nFinished SUCCESS')
        
    }
    }

    /** Execute a query and receive line table metadata and rows. */
    queryApi.queryRows(fluxQuery, fluxObserver)
    res.render('begin')
    
}


