const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;
//5.0.18 mongo version 
const connectDb=async()=>{
    try {
        await mongoose.connect(URI);
        console.log("connection successful to DB");
    } catch (error) {
        console.error("database connection failed",error);
        process.exit(0);
    }
}

module.exports= connectDb;