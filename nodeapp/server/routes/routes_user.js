//Deffine express
const express = require('express');

// New instance of the router object
const router = express.Router();

//Controllers
const userController = require('../controller/userController');
// const influxController = require('../controller/influxController');
const imlController = require('../controller/imlController');
// const timeController = require('../controller/timeController');
const awsController = require('../controller/aws_dataController');
const stateController = require('../controller/stateController');
// const grafana = require('../controller/grafanaController');




// Routes

router.get('/', userController.view);
router.post('/', userController.find);
// router.post('/', userController.find);
// router.get('/begin/:id', userController.begin, awsController.aws_button);
router.get('/begin/:id', userController.begin);
// router.get('/begin/:id', awsController.aws_button);

// router.post('/influx', imlController.influx);

router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:id', userController.edit);
router.post('/edituser/:id', userController.update);
router.get('/viewuser/:id', userController.viewall);
router.get('/:id',userController.delete);



// //Staert the iml calculation
// router.get('/begin/:id/influx', imlController.influx);


// Get the UniqueID 
// router.post('/unique_id', userController.getUnique_id);


//Route to get data 
router.post('/quit', stateController.quit);

// router.get('/begin/:id/aws', awsController.aws_button);
router.post('/aws', awsController.aws_button)

// Buttons for states
router.post("/timestamp", stateController.state_button);

// Buttons for states
router.post("/emotion", stateController.emotion_button);

router.post('/close', awsController.close_python);

//Calling a function through ajax
// router.post('/my-route', awsController.aws_button)

// //Start collecting data locally
// router.get('/begin/data', awsController.getdata);

// //TIme controller
// router.get('/begin/time2', timeController.time2);


//Export modules
module.exports = router;