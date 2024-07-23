import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log("Connected to db");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};
