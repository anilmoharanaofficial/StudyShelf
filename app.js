import { config } from "dotenv";
config();
import express from "express";
import bookRoute from "./routes/bookRoute.js";
import client from "./client.js";
import erroMiddleware from "./middleware/errorMiddleware.js";
import userRoute from "./routes/userRoute.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import readingListRoute from "./routes/readingListRoute.js";
import ejsMate from "ejs-mate";
import session from "express-session";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// EJS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.engine("ejs", ejsMate);

// Session
const secretKey = process.env.SESSION_SECRET;
const sessionOptions = {
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

// Routes
app.use("/api/v1/book", bookRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/readingList", readingListRoute);

client(app);

// ERROR MIDDLEWARE
app.use(erroMiddleware);

export default app;
