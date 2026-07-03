import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Disable buffering so that queries fail immediately if not connected
        mongoose.set('bufferCommands', false);

        mongoose.connection.on("connected", () => { 
            console.log("Database connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set");
        }

        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongodbURI, { 
            dbName: projectName,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            bufferCommands: false // Disable buffering for this connection
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;