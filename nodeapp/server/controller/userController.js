require('dotenv').config();
const { consoleLogger } = require('@influxdata/influxdb-client');
const mysql = require('mysql');
const dbConfig = require("../../config/db.config.js");
// const logger = require('../../logger/logger.js');

// Import aws_dataController
const aws_dataController = require('./aws_dataController')


// INFLUX DB CONFIG
const {InfluxDB} = require('@influxdata/influxdb-client')


const token = process.env.API_KEY;
const org = process.env.ORG_NAME;
const dbPassword = process.env.DATABASE_PASSWORD;

const bucket = 'grafana'
// const bucket2 = 

const client = new InfluxDB({url: 'http://localhost:8086', token: token})
const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})


// MYSQL Connection Pool
let connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// Varibles that define a usertable, CHANGE THIS IF THE USERTABLE VARIABLES CHANGE
const table = 'user2'
const t_id = 'unique_id'
const t_name = 'name'
const t_surname = 'surname'
const t_status = 'status'

// SET QUERIES
// The variables in the square brackets have to be the same as in the table
// [unique_id, name, surname]
const q_view = 'SELECT * FROM ' + table +' WHERE status = "active"'
const q_find = 'SELECT * FROM '+ table + ' WHERE '+ t_name +' LIKE ? OR '+t_surname + ' LIKE ?'
// You have to change the arguments in after q_create
const q_create = 'INSERT INTO '+ table + ' SET '+ t_id + ' = ?, '+ t_name +' = ?, ' + t_surname + ' = ?'
const q_edit = 'SELECT * FROM '+ table + ' WHERE id = ?'
const q_update = 'UPDATE '+ table + ' SET '+ t_id + ' = ? '+ t_name +' = ?, ' + t_surname + ' = ? WHERE id = ?' // Change
const q_delete = 'UPDATE '+ table + ' SET status = ? WHERE id = ?'
const q_viewall = 'SELECT * FROM '+ table + ' WHERE id = ?'
const q_begin = 'SELECT * FROM '+ table + ' WHERE id = ?'



// View Users
exports.view = (req, res) => {
  // User the connection
  connection.query(q_view, (err, rows) => {
    // When done with the connection, release it
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// Find User by Search
exports.find = (req, res) => {
  let searchTerm = req.body.search;
  // User the connection
  connection.query(q_find, ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      console.log(rows)
      res.render('data', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

// Add new user
exports.create = (req, res) => {
  const { unique_id, name, surname } = req.body;
  let searchTerm = req.body.search;

  // User the connection
  connection.query(q_create, [unique_id, name, surname], (err, rows) => {
    if (!err) {
      res.render('add-user', { alert: 'User added successfully.' });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// Edit user
exports.edit = (req, res) => {
  // User the connection
  connection.query(q_edit, [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


// Update User
exports.update = (req, res) => {
  const { unique_id, name, surname } = req.body;
  // User the connection
  connection.query(q_update, [unique_id, name, surname, req.params.id], (err, rows) => {

    if (!err) {
      // User the connection
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        // When done with the connection, release it
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${name} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

// Delete User
exports.delete = (req, res) => {

  // Delete a record

  // User the connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);

  // });

  // Hide a record

  connection.query(q_delete, ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from beer table are: \n', rows);
  });

}


// View Users
exports.viewall = (req, res) => {

  // User the connection
  connection.query(q_viewall, [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });

}

let unique_id;


// Sends unique_id to the INfluxDB
exports.begin = (req, res, next) => {
  connection.query(q_begin, [req.params.id], (err, rows) => {
    if (!err) {
      res.render('begin', { rows });

      // Attempt of accessing the awsgetdata function from begin automatically
      unique_id = rows[0].unique_id;
      // unique_id = 111111
      console.log("userController:", unique_id)
      // exports.unique_id = unique_id
      aws_dataController.aws_button(unique_id);

      

      const { exec } = require('child_process');
      const org = "Lucami_Dev";

      // Create URL
      // C:\MatAnks\setup\Influx\influxdb2-2.0.9-windows-amd64\influxdb2-2.0.9-windows-amd64
      const cmd1 = 'cd C:/Program Files/InfluxData';
      const cmd = `influx bucket create -n ${unique_id} -o ${org} -r 200h`;
      // const cmd = `${cmd1} && ${cmd2}`;
    

      // Execute command
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: Bucket is already created ${error}`);
          return;
        }
        console.log(`stdout: Bucket was not created ${stdout}`);
        console.error(`stderr:  ${stderr}`);
      });

      } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
  // console.log(this.unique_id)
  // aws_dataController.aws_button(unique_id);
}



  // Export the unique_id variable
exports.getUniqueId = () => {
  return unique_id;
};