const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://harshuu001:cu!5H@aZkRJ52uk@cluster0.flyzgd7.mongodb.net/test')

const postSchema = mongoose.Schema({
  postText:{
    type:String,
    require:true
  },
  user:{
    type:mongoose.Schema.Types.ObjectId
  },
  created:{
    type:Date,
    default:Date.now()
  },
  likes:{
    type:Array,
    default:[]
  }
})


module.exports = mongoose.model('post',postSchema)
