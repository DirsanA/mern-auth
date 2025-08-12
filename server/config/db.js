import mongoose from "mongoose";

async function connectDB() {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connection successful");
  });
  // logging when the connection is successful
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
  await mongoose.connect(`${process.env.MONGO_URI}`);
  // create connection with mongoose with the database name of mern-auth
}

export default connectDB;
