const User = require("../models/user-model");

//Update user without putting id
const updateController=async(req,res)=>{    //http://localhost:6680/api/v1/user/updateUser
    try {
        const UpdateData=req.body;
        
        const updateUser = await User.updateOne({_id:req.userGotID},{ $set:UpdateData })
        return res.status(200).json({ success:true , message:updateUser})

    } catch (error) {
        console.log(error)
        res.status(500).json({     success:false,     message:"error in updateController",   error })
    }
}

//get User Data
const getUserController=async(req,res)=>{
    try {
        const getData= await User.findById({_id:req.userGotID}).select({password:0});
        if(!getData){
            return  res.status(200).json({success:false,    message:"User not found" })
        }else{
            res.status(200).json({success:true , data:getData})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,     message:"error in getUserController",   error })
    }
}


module.exports={updateController,getUserController}