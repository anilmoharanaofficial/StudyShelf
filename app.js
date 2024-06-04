import { config } from "dotenv";
config();
import express from "express";
import bookRoute from "./routes/bookRoute.js";
import client from "./client.js";
import erroMiddleware from "./middleware/errorMiddleware.js";
import userRoute from "./routes/userRoute.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

client(app);

// Routes
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/user", userRoute);

// ERROR MIDDLEWARE
app.use(erroMiddleware);

export default app;
