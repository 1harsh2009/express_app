const express = require('express');
const router = express.Router();
const usersModel = require('./users');
const DpModel = require('./dp')
const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const multer = require('multer');
const dp = require('./dp');
const postModel = require("./post")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/images/`); // Replace 'your_upload_folder_path' with the actual path
  },
  filename: function (req, file, cb) {
    var fl = file.mimetype
    var vd = fl.split('/')

    // }); // Adjust the path as needed

  if (req.isAuthenticated() && req.user && req.user.username) {
      const Dpdata = new DpModel({
        username: req.user.username,
        dp: req.user.username + "." + vd[1]
    });

    DpModel.create(Dpdata)
        .then((registereduser) => {
            console.log(registereduser);
            // Handle success, such as sending a success response to the client
            
        })
        .catch((err) => {
            console.error(err);
            // Handle the error, such as sending an error response to the client
            
        });
    } 
    else {
    // Handle case where user is not authenticated or does not have a username
    // res.status(401).send("Unauthorized");
  }


    cb(null, `${req.user.username}`+"."+vd[1]);
  }
});

const upload = multer({ storage: storage });

router.use(express.urlencoded({ extended: false }));
passport.use(new localstrategy(usersModel.authenticate()));

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/upload', (req, res) => {
  res.send('upload'); // Assuming you have an 'upload' view/template
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(404).send('No file uploaded.');
  }

  console.log('File uploaded:', req.file);
  // res.status(200).send('File uploaded!');
  res.redirect('/profile')
});

router.post('/register', (req, res) => {
  const userData = new usersModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  usersModel.register(userData, req.body.password).then((registereduser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect('/profile');
    });
  });
});

router.get('/profile', isLoggedIn, async function(req,res){
  var vc = await DpModel.findOne({username:req.user.username})
  var bk = ""
  var lp = usersModel.countDocuments({}, { hint: "_id_" });
  console.log(lp);
  if (vc==null)
  {
    bk = "https://i0.wp.com/shortshayari.in/wp-content/uploads/2022/11/whatsapp-dp-100.webp"
  }
  else{
    bk = `/images/${vc.dp}`
    console.log(bk);
  }
  res.render('profile', { username: req.user.username, email: req.user.email,img:bk});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), (req, res) => {
  const us = req.body.username;
  res.send(us);
});

router.get('/log', (req, res) => {
  res.render('log');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
