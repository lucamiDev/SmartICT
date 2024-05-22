//Deffine express
const express = require('express');

// New instance of the router object
const router = express.Router();

//Adding the Controller files
const imlController = require('../controller/imlController');
const timeController = require('../controller/timeController');
const awsController = require('../controller/aws_dataController');


//Staert the iml calculation
router.get('/begin/influx', imlController.influx);

//Calling a function through ajax
router.post('/my-route', awsController.aws_button)

//Start collecting data locally
router.get('/begin/data', awsController.getdata);

//TIme controller
router.get('/begin/time2', timeController.time2);


//Export modules
module.exports = router;