import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userModel from "./models/userModel.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

const port = process.env.PORT || 5000;
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Api Endpoints
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", authRouter);

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
