var mysql = require('mysql');
// var Connection = require('tedious').Connection;
var config = require('./config');
var mysqlRequest;
const db = mysql.createConnection(config.dbConfig);

exports.connectToDatabase = function() {
    db.connect((err) => {
        if (err) {
            console.log(err);
            console.log("... Could not connect to MySQL Database! ...");
        } else {
            console.log("Connected to MySQL");
        }
    });
}

exports.checkAuth = function (req, res) {
    console.log(req.query);
    var sql = "SELECT * FROM users WHERE username = '"+req.query.username+"' AND password='"+req.query.password+"'";
    db.query(sql, (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            console.log(result);
            res.send(result);
        }
    });
}

exports.register = function (req, res) {
    console.log(req.body);
    var sql = "INSERT INTO users (username, password, country, gender, loggedInStatus, registeredDate) VALUES ?";
    var values = [
        [
            req.body.username
            ,req.body.password
            ,req.body.country
            ,req.body.gender
            ,false
            ,new Date()
        ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            console.log(result);
            res.send(result);
        }
    });
}

exports.insertPost = function (req, res, fileName) {
    console.log('Inside insertPost ----------- >');
    console.log(req.body);
    console.log(req.files);
    console.log(fileName);
    var sql = "INSERT INTO posts (type, createdBy, message, postUrl, createdDate) VALUES ?";
    var values = [
        [
             'post'
            ,req.body.createdBy
            ,req.body.message
            ,fileName
            ,new Date()
        ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            console.log(result);
            res.send(result);
        }
    });
}

exports.getPosts = function (req, res) {
    console.log(req.query);
    var sql = "SELECT * FROM posts";
    db.query(sql, (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            console.log(result);
            res.send(result);
        }
    });
}

exports.postComment = function (req, res) {
    var sql = "INSERT INTO comments (postId, username, comment, createdDate) VALUES ?";
    var values = [
        [
             req.body.postId
            ,req.body.username
            ,req.body.comment
            ,new Date()
        ]
    ]
    db.query(sql, [values], (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            console.log(result);
            res.send(result);
        }
    });
}

exports.getComments = function (req, res) {
    console.log(req.query+' ---------');
    var sql = "SELECT * FROM comments WHERE postId = "+req.query.postId;
    db.query(sql, (err, result) => {
        if(err) {
            console.log('No internet!');
            console.log(err.sqlMessage);
            res.send(err);
            return;
        } else {
            res.send(result);
        }
    });
}