const logger = require('../../logger/logger');

const token = 'vZQcvi2JcrPvrDBzIVoIZSbjUyF-Jt1DcgpKmozlk23MwuWiUSQbp0JSyc5xkJTKDfmTc0lor4xiQbXj8kL6LQ=='
const org = 'test'
const bucket = 'test3'

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const client = new InfluxDB({url: 'http://localhost:8086', token: token})

const writeApi = client.getWriteApi(org, bucket)



exports.time2 = (req, res) => {
    const timestamp = Date.now();
    console.log('CHECK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    logger.info(timestamp)

    // // Point creation
    // const point1 = new Point('temperature')
    // .tag('timestamp')
    // .floatField('value', timestamp )

    // // Console.log point created
    // console.log(` ${point1}`)

    // // Submit a point
    // writeApi.writePoint(point1)

    // // Close the writePoint
    // writeApi.close().then(() => {
    //     console.log('WRITE FINISHED')
    // })
    // res.end('something');
    // res.render('begin')

}