import { config } from "dotenv";
config();
import express from "express";
import bookRoute from "./routes/bookRoute.js";
import client from "./client.js";
import erroMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client(app);

// Routes
app.use("/api/v1/book", bookRoute);

// ERROR MIDDLEWARE
app.use(erroMiddleware);

export default app;
