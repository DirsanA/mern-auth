import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

const app = express();

const port = process.env.PORT || 5000;
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
