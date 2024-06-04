const express=require('express');
const userAuth = require('../middlewares/authMiddleware');
const { createJobController, getAllJobController, updateJobController, deleteJobController, jobStatsController, getFilterJobController } = require('../controllers/jobsControllers');

const router = express.Router();

//routes
// CREATE JOB || POST
router.route('/create-job').post(userAuth,createJobController)

//GET ALL JOB || GET
router.route('/getAllJob').get(userAuth,getAllJobController)

//UPDATE JOB || PUT || PATCH
router.route('/updateJob/:id').patch(userAuth,updateJobController)

//DELETE JOB || DELETE
router.route('/deleteJob/:id').delete(userAuth,deleteJobController)

//JOBS STATS || GET
router.route('/job-stats').get(userAuth,jobStatsController)

//JOBS FILTER || GET
router.route('/getJobs').get(userAuth,getFilterJobController)


module.exports= router;