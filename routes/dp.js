const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://harshuu001:cu!5H@aZkRJ52uk@cluster0.flyzgd7.mongodb.net/test')

const DPSchema = mongoose.Schema({
  username:String,
  dp:{
    type:String,
    default:"default.png"
  }
})



module.exports = mongoose.model('dp',DPSchema)
