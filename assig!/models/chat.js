const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ChatSchema=new Schema({
    msg:{type:String},
   time:String,
   username:String,
   avatar:String

  
})

module.exports=mongoose.model("chat",ChatSchema);