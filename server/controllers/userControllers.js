const User = require("../models/user-model");
const bcrypt=require('bcryptjs');

//REGISTER
const registerController=async(req,res,next)=>{
    try {
        const {name,email,password,location}=req.body;
        //validation
        if(!name){
            // return  res.status(500).json({    success:false,   message:"please provide name"})
            next('name is required')
        }
        if(!email){
            next('email is required')
        }
        if(!password){
            next('password is required')
        }
        //email check
        const existingUser = await User.findOne({email:email});
        if(existingUser){
            return   next('email is already register please login')
            // return  res.status(500).json({    success:false,   message:"email is already register"})
        }
        //hash the password using bcrypt method1
         const saltRound=10;
         const hash_Password= await bcrypt.hash(password,saltRound);

         
        //user creation
        const userCreated = await User.create({name,email,password:hash_Password,location})
        //user token
        const token= await userCreated.createJWT();    

        res.status(200).json({
            success:true,
            message:"registeration successfull",
            user:{
                name: userCreated.name,
                email: userCreated.email,
                location: userCreated.location,
                 },
            token
        })
    } catch (error) {
        console.log(error);
        // res.status(500).json({     success:false,     message:"error in registerController",   error })
      return  next("error in registerController");
    }
}

//LOGIN
const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return  res.status(500).json({    success:false,   message:"please provide all details"})
        }
        //check email
        const existEmailUser = await User.findOne({email:email});
        // console.log(existEmailUser);
        if(!existEmailUser){
            return  res.status(500).json({    success:false,   message:"invalid email or password"})
        }
        //check password
        const checkPassword=await bcrypt.compare(password,existEmailUser.password)
        // console.log(checkPassword);
        if(!checkPassword){
            return  res.status(500).json({    success:false,   message:"invalid email or password"})
        }
        res.status(200).json({
              success:true,  
              message:"Login Successful",
              token: await existEmailUser.createJWT(),
              userId: existEmailUser._id.toString(),
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({     success:false,     message:"error in loginController",   error })
    }
}

module.exports={registerController,loginController}