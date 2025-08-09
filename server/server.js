import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 5000;
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.listen(port, function () {
  console.log(`the server is listenning at port ${port}`);
});
