// Credentials and setup for influxDB
require('dotenv').config();
const {InfluxDB} = require('@influxdata/influxdb-client')
const { use } = require('../routes/routes_user')
const userController = require('./userController')

// You can generate an API token from the "API Tokens Tab" in the UI
// const token = 'v1swk9_enBXFVQvqvhi2jxYOSbtGIAaCLVBQRSaDynKq6lE1guX0R_pyf6uzVhR5DXtgMZrmbYuH8l3NIzV_jw=='
// const org = 'lucami'



const token = process.env.API_KEY;
const org = process.env.ORG_NAME;
const bucket = 'buttons'

const client = new InfluxDB({url: 'http://localhost:8086', token: token})


// Code to acctually write to influxDB
function sendToInflux(bucket, button, topic, value) {
  const {Point} = require('@influxdata/influxdb-client')
  const writeApi = client.getWriteApi(org, bucket)
//   writeApi.useDefaultTags({host: 'host1'})
  console.log(button)
  const point = new Point('button').tag('type', topic).floatField(button, value);
      writeApi.writePoint(point)
  
  writeApi
      .close()
      .then(() => {
          console.log('FINISHED')
      })
      .catch(e => {
          console.error(e)
          console.log('Finished ERROR')
      })
  
}

// Send state data
exports.state_button = (req, res) => {
    const unique_id = userController.getUniqueId()
    console.log("sate controller", unique_id)
    const buttonId = req.body.buttonId;
    const timestamp = Math.floor(Date.now() / 1000);
    console.log( buttonId, timestamp)
    sendToInflux(unique_id,"state", buttonId, timestamp)
    sendToInflux("grafana","state", buttonId, timestamp)

    res.send('Received your request!');
    
  }

// Send emotion data
exports.emotion_button = (req, res) => {
    const unique_id = userController.getUniqueId()
    console.log("sate controller", unique_id)
    const buttonId = req.body.buttonId;
    const timestamp = Math.floor(Date.now() / 1000);
    console.log(buttonId, timestamp)
    sendToInflux(unique_id,"emotion", buttonId, timestamp)
    sendToInflux("grafana", "emotion", buttonId, timestamp)
    res.send('Received your request!');
  }



  
exports.quit = (req, res) => {
  const { spawn } = require('child_process');
  const bat = spawn('cmd.exe', ['/c', 'C:\\Users\\Lucami_Sig\\Desktop\\stop.bat']);


  bat.stdout.on('data', (data) => {
      console.log(data.toString());
  });

  // bat.stderr.on('data', (data)=> {
  //     console.error(data.toString());
  // });

  // bat.on('exit', (code) => {
  //     console.log('Child process exited with code ')
  // })
  

}