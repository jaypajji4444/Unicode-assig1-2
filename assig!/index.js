const express=require("express");
const mongoose=require("mongoose");
const app=express();
const bodyParser=require("body-parser");
const Restro=require("./models/data");
const router=express.Router();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



const db=async ()=>{
    await mongoose.connect("mongodb://localhost:27017/Restuarant",{useNewUrlParser:true});
   
}

db().catch(err=>console.log(err));


const RestRoute=require("./routes/res");
const UserRoute=require("./routes/User");



app.use("/Restuarant",RestRoute);
app.use("/User",UserRoute);


/*
app.get("/Restuarant/:id",async(req,res)=>{
    var id=req.params.id;
    Restro.find({id:id},(err,data)=>{
        if(err)res.send({success:false,Error:err})
        else{
          res.send({success:true,data:data})
          //console.log(req.body)
        }
    })
})

*/




 

app.listen(8080,()=>{
    console.log("The connection is established suceesfully on port 8080...")
})