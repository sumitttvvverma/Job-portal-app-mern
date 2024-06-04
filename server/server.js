require('dotenv').config()

const express=require('express');
const cors=require('cors');

const connectDb=require('./utils/db')
const userRoute=require('./routes/userRoutes');
const jobRoute=require('./routes/jobsRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app=express();


//middleware
app.use(express.json())     //to deal with json data || req,res working k liye
app.use(cors());

app.get('/',(req,res)=>{
    res.send("welcome to the job portal")
})

//routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/job',jobRoute)


//validation middleware ||errorMiddleware  must be after all routes
app.use(errorMiddleware)

const PORT = 6680;

//testing connection mongodb and server running
connectDb().then(()=>{

    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`);
    })

})