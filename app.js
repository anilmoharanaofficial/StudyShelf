import { config } from "dotenv";
config();
import express from "express";
import bookRoute from "./routes/bookRoute.js";
import clients from "./clients.js";
import erroMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

clients(app);

// Routes
app.use("/api/v1/book", bookRoute);

// ERROR MIDDLEWARE
app.use(erroMiddleware);

export default app;
