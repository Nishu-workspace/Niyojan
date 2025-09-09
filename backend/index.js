import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";
dotenv.config();

const app = express();

//cors configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

//db connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log(`Failed to connect to Db, Error: ${err}`);
  });
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to the Project API",
  });
});

app.use("/api-v1", routes);
//error middleware
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).json({ message: "Internal Server error" });
});

//not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
