const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/test')

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
