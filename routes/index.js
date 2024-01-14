const express = require('express');
const router = express.Router();
const usersModel = require('./users');
const DpModel = require('./dp')
const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const multer = require('multer');
const postModel = require("./post")
const upload2 = require("./multer")
const sharp = require('sharp');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/images/`); // Replace 'your_upload_folder_path' with the actual path
  },
  filename: async function (req, file, cb) {
    var fl = file.mimetype
    var vd = fl.split('/')

    // }); // Adjust the path as needed
      var hgo = await DpModel.findOne({username:req.user.username})
      console.log(hgo);
      if (hgo == null){
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
        res.status(401).send("Unauthorized");
      }     
      cb(null, `${req.user.username}`+"."+vd[1]);
      sharp(file.path)
        .resize(200, 200)
        .toFile(`./public/images/${req.user.username}.${vd[1]}`, (err, info) => {
            if (err) {
                console.error("Sharp Error:", err);
            } else {
                console.log("Sharp Info:", info);
            }
        });
      }
      else if (hgo != null){
        DpModel.updateOne(
          { username:req.user.username },
          { $unset: { dp: `${req.user.username}`+"."+vd[1] } }
       )
       cb(null, `${req.user.username}`+"."+vd[1]);
      }
      
  }
});

const upload = multer({ storage: storage });

router.use(express.urlencoded({ extended: false }));
passport.use(new localstrategy(usersModel.authenticate()));

router.get('/', (req, res) => {
  res.render('index', { title: 'Express',error:req.flash('error') });
});

router.get('/upload', (req, res) => {
  res.send('upload'); // Assuming you have an 'upload' view/template
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(404).send('No file uploaded.');
  }

  // console.log('File uploaded:', req.file);
  // res.status(200).send('File uploaded!');
  res.redirect('/profile')
});

router.post('/register', (req, res) => {
  const userData = new usersModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });
  
  usersModel.register(userData, req.body.password)
    .then((registereduser) => {
      passport.authenticate("local")(req, res, () => {
        res.redirect('/profile');
      });
    })
    .catch((err) => {
      // Handle registration errors here
      console.error("Registration error:", err);
      // You can send an appropriate response to the client, redirect to an error page, etc.
      res.status(500).send("Registration failed. Please try again.");
      
      // req.flash("error","username already exist")
      // res.redirect("/")
    });
  
});

router.get('/profile', isLoggedIn, async function(req,res){
  var vc = await DpModel.findOne({username:req.user.username})
  var bk = ""
  
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

router.post('/logout',isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/');
  });
});
router.post("/createpost",isLoggedIn,upload2.single('post-img'),(req,res,next) =>{
  if(!req.file){
    return res.status(400).send('no file uploaded')
  }
  res.send("filw up")
})
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
}

// router.listen(3000)

module.exports = router;
