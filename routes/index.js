var express = require('express');
var https = require('https');
var querystring = require('querystring');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', user: req.user});
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res, next) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},function(e,docs){
        res.render('userlist', {
            userlist: docs,
            title: 'User List'
        });
    });
});

/* GET New User page. */
router.get('/newuser', function (req, res) {
    res.render('newuser', {title: 'Add New User'}); 
}); 

/* POST to Add User Service */
router.post('/adduser', function (req, res) {
    var db = req.db; 
    var userName = req.body.username; 
    var userEmail = req.body.useremail; 
    var collection = db.get('usercollection'); 
    collection.insert({
        "username": userName, 
        "email": userEmail
    }, function (err, doc) {
        if (err) {res.send("There was a problem adding the information")}
        else { res.redirect("userlist");}
    }); 
}); 

router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {res.redirect('profile')} 
    else return next(); 
}, function (req, res) {
    res.render('login', {title: "Login!"});
}); 

router.post('/login', passport.authenticate('local', {
    successRedirect: 'profile', 
    failureRedirect: 'login'
})); 

router.get('/logout', function (req, res) {
    req.logout(); 
    res.redirect('/first_express_app'); 
}); 

router.get('/profile', function(req, res, next) {
    if (req.isAuthenticated()) {return next();} 
    else res.redirect('login'); 
}, function (req, res) {
    res.render('profile', {
        user: req.user, 
        title: "Your Profile!",
        userString: JSON.stringify(req.user)
    }); 
});

router.get('/newaccount', function(req, res, next) {
    if (req.isAuthenticated()) {res.redirect('profile')} 
    else return next(); 
}, function (req, res) {
    res.render('newaccount', {title: "Make New Account!"});
});

router.post('/newaccount', function (req, res) {
    var db = req.db; 
    var collection = db.get('actualUserCollection'); 
    
    // Recaptcha setup
    var recapt = req.body['g-recaptcha-response'];
    var secret = process.env.FIRST_EXPRESS_APP_RECAPTCHA_SECRET;
    var post_data = querystring.stringify({
        'secret': secret,
        'response': recapt, 
        'remoteip': req.ip
    });
    console.log(post_data); 
    var options = {
        host: 'www.google.com',
        port: 443,
        path: '/recaptcha/api/siteverify',
        method: 'POST', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Content-Length': post_data.length
        }
    };
    var captcha_status = false; 
    var recapt_req = https.request(options, function (recapt_res) {
        console.log('status: ' + recapt_res.statusCode); 
        console.log('headers: ' + JSON.stringify(recapt_res.headers)); 
        recapt_res.setEncoding('utf8'); 
        recapt_res.on('data', function (chunk) {
            console.log('BODY: ' + chunk); 
            var recapt_result = JSON.parse(chunk); 
            captcha_status = recapt_result.success; 
            console.log("CAPTCHA STATUS IS: "+captcha_status); 
            if (captcha_status) {
                collection.insert({
                    _id: collection.id(),
                    username: req.body.username, 
                    password: req.body.password
                }, function (err, doc) {
                    if (err) {res.send("There was a problem adding the information")}
                    else { res.redirect("login");}
                }); 
            } else {
                res.redirect("login");
            };
        }); 
        recapt_res.on('end', function () {
            console.log("No more data in response."); 
        }); 
    }); 
    recapt_req.on('error', function (e) {
        console.log("Problem with Recaptcha request: "+ e.message); 
    }); 
    recapt_req.write(post_data); 
    recapt_req.end();     
}); 

module.exports = router;
