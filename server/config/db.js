import mongoose from "mongoose";

async function connectDB() {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection successful");
  });
  await mongoose.connect(`mongodb://localhost:27017/mern-auth`);
}

export default connectDB;
