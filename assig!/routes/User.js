const express=require("express");
const router=express.Router();
const User=require("../models/User");
const  mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");


router.post("/signup",(req,res)=>{
console.log(req.body.email);
User.findOne({email:req.body.email})
.exec()
.then(user=>{
    if(user){
        console.log(user)
        return res.status(409).json({message:"email already Exists"}) //409===conflict code
    }
    else{

        
    bcrypt.hash(req.body.password,10,((err,hash)=>{//10-salting rounds    
        if(err)
        {
        res.status(500).json(
        {success:false,Error:err})}
    
    else
    {
        const user=new User({
           
            email:req.body.email,
            password:hash 
        });
        
        user.save()
        .then(data=>{
            console.log(data)
            res.status(201).json({success:true,message:"User Added"})
        })
        .catch(err=>{
            res.status(500).json({success:false,Error:err})
        })
    }
    
        }))

    }
})

});



router.delete("/:id",(req,res)=>{
    User.remove({_id:req.params.id})
    .exec()
    .then(data=>{
        res.status(200).json({success:true,message:"Deletion Succesfull"})

    })
    .catch(err=>{
        res.status(500).json({success:false,Error:err})
    })
})



router.post("/login",(req,res)=>{
    User.findOne({email:req.body.email})
    .exec()
    .then(user=>{//check whether thr user with entered email exists
        if(!user){
            res.status(404).json({success:false,msg:"Not Authorized"})
        }

        bcrypt.compare(req.body.password,user.password,(err,data)=>{ //if  match then data will have true, else false
            if(err){
               return res.status(404).json({success:false,Message:"Not Authorized.."})
            }
            if(data){ // data===true
              const token= jwt.sign(  //sign(payload,secretkey,options,tokenCallback==>optional)
                    {email:user.email,id:user._id},
                    "jayKey",
                    {
                        expiresIn:"1h"
                    }
                    )
               return res.status(200).json(
                   {success:true,Message:"Authorized.....",token:token}
                   )
            }

            res.status(401).json({success:false,Message:"Not Authorized"})// data==false i.e wrong password...

        })
         
    })
})


module.exports=router;




