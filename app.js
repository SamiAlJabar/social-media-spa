var express = require('express');
var morgan = require('morgan');
const bodyParser = require('body-parser');
var path = require('path');
var PORT = process.env.PORT || 3000

var app = express();
var allRoutes = require('./routes');
var dbHandler = require('./dbHandler');

// Joining directories into one
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// URL encoded for values in BODY during POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logs all request information and time
app.use(morgan('tiny'));

// Database Connection
dbHandler.connectToDatabase();

// Routing
app.use('/', allRoutes);


app.listen(PORT, function () {
    console.log("Server started on port " + PORT + "...");
});

// setInterval(intervalFunc, 1500);
// function intervalFunc() {
//     console.log('Timer yay!');
// }
