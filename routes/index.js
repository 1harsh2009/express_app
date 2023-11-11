var express = require('express');
var router = express.Router();
var usersModel = require('./users')
passport = require('passport')
var localstrategy = require('passport-local')
passport.use(new localstrategy(usersModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next) {
  var userData = new usersModel({
    username: req.body.username,
    password:req.body.password,
    email:req.body.email
  })

  usersModel.register(userData,req.body.password).then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })

  })
});
router.get('/profile',isLoggedIn,function(req,res){
  res.render("profile",{username:req.user.username,email:req.user.email})
})
router.post('/login',passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(res,req){
  const us = req.body.username
  res.send(us)
})

router.get("/log",function(req,res){
  res.render("log")
})
// router.get("/logout",function(res,req,next){
//   req.logout(function(err){
//     if(err) {return next(err)};
//     console.log(err);
//     res.redirect("/");
//   })
// })
router.get("/logout", function(req, res, next) {
  req.logout(function(err){console.log(err);}); // Assuming that req.logout() handles the user logout, no need to pass a callback here
  res.redirect("/");
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/")
}
module.exports = router;
