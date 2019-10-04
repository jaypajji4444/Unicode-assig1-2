const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const menuItem=new Schema({  
        id:String,
        itemName:String,
        foodType:String,
        price:Number,
        jainOptions:String,
        category:String
})

const RestroSchema=new Schema({
    id:{ type:String},
    restro:{
        name:String,
        address:{
            road:String,
            city:String,
            State:String
        },
        AvgForTwo:{
            price:Number,
            currency:String,
        }

    },
    meniItem:[menuItem]


})

const Restro=mongoose.model("rest",RestroSchema);
module.exports=Restro;
