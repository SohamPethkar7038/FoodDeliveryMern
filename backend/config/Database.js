import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            dbName: "foodDelivery",
        });
        console.log(`mongodb connected ${conn.connection.host}`);
    
    } catch (error) {
        console.log("failure in database connection");
        process.exit(1);
    }
}

export default connectDB;