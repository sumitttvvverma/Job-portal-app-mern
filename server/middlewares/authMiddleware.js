const JWT=require('jsonwebtoken');
const User = require('../models/user-model');

const userAuth=async(req,res,next)=>{
    try {
        const token=req.header("Authorization"); 
        if(!token){
            //if you attempt to use an expired token, you'll receive a '401 unauthorized Http' response
           return res.status(401).json({msg:"Unauthorized HTTP,tokan not provided"});
        }
         //Assuming token is in the format "Bearer <jwtToken>", Removing the "Bearer" profix
        const jwtToken =token.replace("Bearer","").trim();
        
        //to verify token 
        const isVerified= JWT.verify(jwtToken,process.env.JWT_SECRET);
        // console.log(isVerified);

        //to get user from token
        const userData=await User.findOne({email:isVerified.email}).select({
            password:0,
        });
        // console.log(userData);

        req.userGot=userData
        req.userGotID=userData._id
        // res.status(200).json({success:true,    message:"Authorization success"})    //---only for useAuth response
        next();
    
    } catch (error) {
        console.log("jwt authmiddleware",error)
        res.status(500).json({
            success:false,
            message:"Authorization failed"
        })        
    }
}

module.exports=userAuth;