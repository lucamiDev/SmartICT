//MAIN SEREVRE THAT SETS UP THE NODE.JS APP

const path = require("path")
const express = require("express")
const exphbs = require('express-handlebars');

//Maybe .env file

//initialize
const app = express()

//Handles POST/PUT requests
app.use(express.urlencoded({extended: true}))
app.use(express.json())


//Static files
app.use(express.static("public"))

//SOMETHING WE RANDER TO THE BROWSER, WE DEFFINE WHERE THE VIEWS ARE
app.set("views",  "views")


//USE HANDLDEBARS EXPRESS ENGINE
const handlebars = exphbs.create({ extname: '.hbs', });
app.engine('.hbs', handlebars.engine);
app.set("view engine", "hbs")


//ALL THE ROUTES GET HANDLED BY THE ROUTER

//User routes
const routes = require('./server/routes/routes_user')
// const imlRoutes = require('./server/routes/routes_iml')


//Machiine learning and data routes
app.use("/", routes)
// app.use("/", imlRoutes)


//Listens for get requests
app.listen(3001, () => {
    console.log("The server is running on port 3001")
})