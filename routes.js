const bodyParser = require('body-parser');
var express = require('express');
var router = express();
var upload = require("express-fileupload");

var dbHandler = require('./dbHandler');

router.use(upload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// AUTH
router.get('/checkLogin', function (req, res) {
    dbHandler.checkAuth(req, res);
});

// Get Posts and its comments
router.get('/getPosts', function (req, res) {
    dbHandler.getPosts(req, res);
});

// Get Comments
router.get('/getComments', function (req, res) {
    dbHandler.getComments(req, res);
});

// User Registration
router.post('/register', function (req, res) {
    dbHandler.register(req, res);
});

// Post Comment
router.post('/postComment', function (req, res) {
    dbHandler.postComment(req, res);
});

// Create Post
router.post('/profilePictureUpload', function (req, res) {
    var currentDate = new Date();
    var randomString = currentDate.toDateString() + "_" + Math.random().toString(36).substring(7) + "_" +Math.random().toString(36).substring(7)+ "_";
    try {
        if(req.files) {
            req.files.image.mv("./public/uploads/"+req.files.image.name+'_'+randomString+'.jpg', async function(err) {
                if(err) {
                    console.log("ERR: -- -- - -- -- -- --------------- - - - - --");
                    res.send("Error Occureds!");
                } else {
                    console.log("NOT ERRR-- -- - -- -- -- --------------- - - - - --");
                    if(req.body.redirect) {
                        await dbHandler.insertPost(req, res, '/uploads/'+req.files.image.name+'_'+randomString+'.jpg');
                        // res.redirect(req.body.redirect);
                    } else {
                        await dbHandler.insertPost(req, res, '/uploads/'+req.files.image.name+'_'+randomString+'.jpg');
                        // res.redirect('back');
                    }
                }
            });
        }
    } catch(e) {
        console.log(e);
    } finally {
        console.log("ERROROROROROROROROROROROROROROROROROOROR");
        // res.sendFile('views/index.html', { root: __dirname });
    }
});

module.exports = router;
