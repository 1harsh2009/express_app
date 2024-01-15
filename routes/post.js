const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://harsh:harsh001@cluster0.flyzgd7.mongodb.net/?retryWrites=true&w=majority')

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
