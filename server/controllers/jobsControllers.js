const Job = require("../models/jobs-model");
const mongoose=require('mongoose');
const moment=require('moment');

const createJobController = async(req,res)=>{   //http://localhost:6680/api/v1/job/create-job
    try {
        const {company,position}=req.body;  //other fields are by default
        if(!company || !position){
           return res.status(400).json({success:false,     message:"please provide all details"})
        }
        req.body.createdBy=req.userGotID  //from authMiddleware for givin data createdBy without writing in body to manage relation b/w jobModel,userModel
        // const createJob = await Job.create({company,position,status,workType,workLocation,createdBy});
        const createJob = await Job.create(req.body);
        res.status(200).json({
            success:true,
            message:"Job created successfully",
            createJob            
        })
    } catch (error) {   
            console.log(error)
            res.status(500).json({     success:false,     message:"error in createJobController",   error })
    }
}


//get all jobs by createdBy or req.userGotID/ Bearer token / userAuth
const getAllJobController = async(req,res)=>{     //http://localhost:6680/api/v1/job/getAllJob
    try {
        // const getAllJob = await Job.find({});
        const getAllJob = await Job.find({
            createdBy:req.userGotID  //without condition also work and u will get ALL
        });
        if(!getAllJob){
          return  res.status(400).json({success:false,     message:"No job found"})
        }
        res.status(200).json({ success:true , totalJobs:getAllJob.length  , getAllJob })
    } catch (error) {
        console.log(error)
        res.status(500).json({     success:false,     message:"error in getAllJobController",   error })
    }
}

//update jobs
const updateJobController=async(req,res)=>{     //http://localhost:6680/api/v1/job/updateJob/:id
    try {
        const updateData=req.body;
        const getJobFirst=await Job.findOne({_id:req.params.id});
        if(!getJobFirst){
            return res.status(500).json({success:false, message:"no job found with this id"})
        }
        // console.log(req.userGotID);
        // console.log(getJobFirst.createdBy.toString());
        
        //To check the login user is authorized to update data or not
        if(req.userGotID == getJobFirst.createdBy.toString() ){
            const updateJob= await Job.updateOne({_id:req.params.id},{$set:updateData})
            return  res.status(200).json({ success:true, message:"job updated" ,updateJob})
        }
        res.status(500).json({success:false, message:"not authorizired to update"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"error in update job controller", error})
    }
}


//delete jobs
const deleteJobController=async(req,res)=>{     //http://localhost:6680/api/v1/job/deleteJob/:id
    try {
        const getJobFirst=await Job.findOne({_id:req.params.id});
        if(!getJobFirst){
            return res.status(500).json({success:false, message:"no job found with this id to delete "})
        }
        //   console.log(req.userGotID);
        //   console.log(getJobFirst.createdBy.toString());

        //To check the login user is authorized to delete data or not
        if(req.userGotID == getJobFirst.createdBy.toString() ){
            const deleteJob= await Job.deleteOne({_id:req.params.id})
            return  res.status(200).json({ success:true, message:"job deleted" ,deleteJob})
        }
        res.status(500).json({success:false, message:"not authorizired to delete"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"error in delete job controller", error})
    }
}


//------------------JOBS STATS & FILTERS---------------- AGGREGATION
const jobStatsController=async(req,res)=>{      //http://localhost:6680/api/v1/job/job-stats
    try {
        const stats= await Job.aggregate([
            //sereach by user jobs  :stats
            {
                //stage 1 : match
                $match:{
                    createdBy: new mongoose.Types.ObjectId(req.userGotID)
                },
            },
            {
                //stage 2 : group
                $group:{
                    _id:'$status',
                    count: {$sum:1}
                } 
            }   
        ])

        //default stats     //for that user who have no job-data
        const defaultStats={
            pending:stats.pending || 0,
            reject:stats.reject || 0,
            interview:stats.interview || 0,
        }

        //monthly yearly stats
        let monthlyApplication = await Job.aggregate([
            {
                $match:{
                    createdBy: new mongoose.Types.ObjectId(req.userGotID)
                },
            },
            {
                $group:{
                    _id:{
                        year:{$year:'$createdAt'},
                        month:{$month:'$createdAt'}
                    },
                    count: {$sum:1}
                } 
            }   
        ])

        //monthly year better view using moment
        monthlyApplication=monthlyApplication.map((item)=>{
            const {_id:{year,month},count}=item                    //destructuring object
            const date= moment().month(month-1).year(year).format('MMM Y')      //month-1 used to represent jan=0 
            return {date,count};
        });

        res.status(200).json({ totalJob:stats.length, stats,defaultStats,monthlyApplication});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false , message:"error in  job stats controller", error})
    }
}

//-------FILTER-------
const getFilterJobController = async(req,res)=>{     //http://localhost:6680/api/v1/job/getJobs?status=pending or interview or reject
    try {
        const {status , workType , search , sort}=req.query;     //destructuring object /req.query.status
        //conditions for searching filters
        const queryObject={
            createdBy:req.userGotID
        }
        //logic filters
        if(status && status!=="all"){
            queryObject.status=status;
        }
        if(workType && workType!=="all"){       //"full-time", "part-time", "internship", "contaract"
            queryObject.workType=workType;
        }
        //searching 
        if(search){
            queryObject.position={$regex:search , $options:'i'};
        }

        let queryResult =  Job.find(queryObject);


        const relateJobs= await queryResult;
        // console.log(relateJobs.length)

        //sorting
        if(sort === 'latest'){
            queryResult = queryResult.sort('-createdAt');
        }
        if(sort === 'oldest'){
            queryResult = queryResult.sort('createdAt');
        }
        if(sort === 'a-z'){
            queryResult = queryResult.sort('position');
        }
        if(sort === 'z-a'){
            queryResult = queryResult.sort('-position');
        }

        //pagination
        const page= Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 10;
        const skip= (page-1)*limit;

        queryResult=queryResult.skip(skip).limit(limit)
        
        const jobs=await queryResult;           //jobs.length=limit and jobs only provide according to pagination in page , if pagination not happens it shows all the jobs and its whole length in a page
        // console.log(jobs.length)

        //jobs count and page count
        const totalJobs= await Job.count();     //jobs count direct to model
        // console.log(totalJobs)
        const numOfPage=Math.ceil(totalJobs / limit);    //pages count

        res.status(200).json({ success:true , TotalJobs:totalJobs , TotalPages:numOfPage , RelateJobs:relateJobs.length ,JobsInPage:jobs.length , jobs  })
    } catch (error) {
        console.log(error)
        res.status(500).json({     success:false,     message:"error in getFilterJobController",   error })
    }
}

module.exports={createJobController,getAllJobController,updateJobController,deleteJobController,jobStatsController,getFilterJobController}