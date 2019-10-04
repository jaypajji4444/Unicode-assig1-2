const express=require("express");
const route=express.Router();

const Restro=require("../models/data");
const Auth=require("../Middleware/auth");




//get all restuarant
route.get("/",Auth,async(req,res)=>{
   
    try{
        const restroList=await Restro.find({});
        res.status(200).json({success:true,data:restroList})
    }
    catch(e){
        res.status(404).send({success:false,msg:e})
    }
})



// Get the entire restuarant details by id
route.get("/:id",Auth,async(req,res)=>{
    var id=req.params.id;
    try{
        const getData=await Restro.findOne({id:id})
        res.send({success:true,data:getData})
    }
   catch(err){
        res.send({success:false,Error:err})
   }

})



//post new restuarant 
route.post("/",Auth,async(req,res)=>{
    try{
        const NewRestro= await Restro.create(req.body) 
        res.send({success:true,data:NewRestro});
    }
    catch(err){
        res.send({success:false,msg:err});
    }
})


// update new
route.put("/:id",Auth,async(req,res)=>{
       
try{
       await Restro.findOneAndUpdate({id:req.params.id},req.body);
       var restro=await Restro.findOne({id:req.params.id});
           res.status(202).send({success:true,data:restro});
}
catch(e){
    res.send({success:false,err:e})
}
})


route.delete("/:id",Auth,async(req,res)=>{

  try{
        await Restro.deleteOne({id:req.params.id});
        res.status(202).send({success:true,message:`succesfull Deletion of resturant with id:${req.params.id}`});
  }
  catch(e){
      res.send({success:false,err:e})
  }
})


module.exports=route;
