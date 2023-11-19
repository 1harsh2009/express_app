// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;


const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/test')

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  dateCreated:{
    type:Date,
    default:Date.now()
  },
  post:[]
})

userSchema.plugin(plm)

module.exports = mongoose.model('user',userSchema)
