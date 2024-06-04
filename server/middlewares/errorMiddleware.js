//custom error middleware || NEXT function
const errorMiddleware=async(err,req,res,next)=>{
    
        console.log(err)
        res.status(500).json({
            success:false,
            message:"something went wrong",
            err
        })
  
} 

module.exports=errorMiddleware;