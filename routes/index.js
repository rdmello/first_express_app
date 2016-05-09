var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res, next) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res, next) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
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

router.get('/login', function (req, res) {
    res.render('login', {title: "Login!"});
}); 

router.post('/login', passport.authenticate('local', {failureRedirect: 'login'}), function (req, res) {
    res.redirect('profile'); 
}); 

router.get('/logout', function (req, res) {
    req.logout(); 
    res.redirect('/'); 
}); 

router.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
    res.render('profile', {user: req.user, title: "Your Profile!"}); 
});

router.get('/newaccount', function (req, res) {
    res.render('newaccount', {title: "Make New Account!"});
});

router.post('/newaccount', function (req, res) {
    var db_test = req.db_test; 
    db_test.users.insertNew(req.body.username, req.body.password);
    res.redirect("userlist");
}); 

module.exports = router;
