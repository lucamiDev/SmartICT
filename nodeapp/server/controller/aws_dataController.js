
// const logger = require('../../logger/logger');
const moment = require("moment");
const { PythonShell } = require('python-shell');
const psTree = require('ps-tree');
// Calling the camera
const { spawn } = require('child_process');


let pyshellList= [];
const pyshellProcesses = [];


// Function that runs PythonShell
function runPythonScripts(inputParam) {
    // Options for AWS and Tobii
    const options2 = {
      mode: 'text',
      pythonOptions: ['-u'], // recommended to unbuffer Python output
      
      scriptPath: './Model',
      // scriptPath: 'C:/Users/jeans/OneDrive/Namizje/matAnks/nodeapp/Model/Camera/examples/skeleton_detection/demo.py',
      args: [inputParam],
    };

    // Options for Camera
    const options = {
      mode: 'text',
      pythonOptions: ['-u'], // recommended to unbuffer Python output
      // C:\Users\jeans\OneDrive\Namizje\matAnks\nodeapp\Model\Camera\examples\skeleton_detection\camera.py
      // scriptPath: 'C:/Users/jeans/OneDrive/Namizje/matAnks/nodeapp/Model/Camera/examples/skeleton_detection/',
      cwd: './Model/Camera',
     
      // C:\Users\Lucami_Sig\Documents\MatAnks\outside\MatAnks\new\nodeapp\Model\tobii.py
      env: {
        BUCKET: inputParam // pass an environment variable to Python
      },
  };
    // console.log(inputParam)
    
    const tobii = new PythonShell('tobii.py', options2);
    // const get_aws_data  = new PythonShell('get_aws_data.py', options2);
    const camera = new PythonShell('camera.py', options);
    // const send_avro_data = new PythonShell('send_avro_data.py', options2);
    

    
    pyshellProcesses.length = 0;
    pyshellProcesses.push(tobii.childProcess.pid);
    pyshellProcesses.push(camera.childProcess.pid);
    // pyshellProcesses.push(get_aws_data.childProcess.pid);
    // pyshellProcesses.push(send_avro_data.childProcess.pid);
    
    console.log("tukaj so pidi", pyshellProcesses)

    // pyshellList = [tobii, get_aws_data, camera];
    pyshellList = [tobii, camera];


    
    pyshellList.forEach((pyshell) => {
          // Events
      pyshell.on('message', (message) => {
        console.log(message);
      });
      pyshell.on('error', (error) => {
        console.error(error);
        reject(error);
      });
      pyshell.on('close', (code) => {
        console.log(`Script exited with code ${code}`);
      });

    })
    
}


exports.aws_button = async (unique_id, req, res) => {
  try {
    // console.log("Aws_data: ", unique_id)
    // Gets a date 
    const date = moment().format("DD.MM.YY")

    // Call camera fucntion


    // child.stderr.on('data', (data) => {
    //   console.error(`stderr: ${data}`);
    // });

    // Parameters for PythonShell
    // const pythonScripts = ['C:\Users\jeans\OneDrive\Namizje\matAnks\nodeapp\Model\Empatica\get_aws_data.py'];

    // Gathers date and UniqueId
    const inputParam = date + ' ' + unique_id ;
    console.log(inputParam)
    // pythonScripts,
    // Runs python script
    runPythonScripts( inputParam);

    // Runs results from python
    console.log('Python scripts finished successfully');

  } catch (err) {
    console.error('Error in Node.js app:', err);
    // res.status(500).send('Internal Server Error');
  }
};


function closePythonScripts(pyshellProcesses) {
  console.log(pyshellProcesses)
  pyshellProcesses.forEach((pid) => {
    process.kill(pid);
    psTree(pid, (err, children) => {
      if (err) {
        console.error(err);
      }
      children.forEach((child) => {
        process.kill(child.PID);
      });
    });
  });
}


exports.close_python = async (req, res) => {
  try {
    console.log('Pyshell children were closed!');
    closePythonScripts(pyshellProcesses);
    console.log('Pyshell children were closed!');
    
  } catch (err) {
    console.error('Error in Node.js app:', err);
    // res.status(500).send('Internal Server Error');
  }

  // res.redirect("/")
};
