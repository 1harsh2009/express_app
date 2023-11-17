const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/test')

const DPSchema = mongoose.Schema({
  username:String,
  dp:{
    type:String,
    default:"default.png"
  }
})



module.exports = mongoose.model('dp',DPSchema)
