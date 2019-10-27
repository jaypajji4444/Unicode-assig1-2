const jwt=require("./node_modules/jsonwebtoken");
module.exports=(req,res,next)=>{
    try{
       // console.log(req.headers.authorization)
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
        
        const decodedData=jwt.verify(bearerToken,"jayKey");
        req.newData=decodedData; // if in case ,future mai use kerna ho..
        //console.log(decodedData)
        next();
        }
        
    }
catch(err){
    return res.status(401).json({success:false,Message:err})
}
    
}