const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://harsh:harsh001@cluster0.flyzgd7.mongodb.net/?retryWrites=true&w=majority')

const DPSchema = mongoose.Schema({
  username:String,
  dp:{
    type:String,
    default:"default.png"
  }
})



module.exports = mongoose.model('dp',DPSchema)
