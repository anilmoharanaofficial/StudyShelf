import { Router } from "express";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import {
  addToReadingList,
  removeItemsReadingList,
  viewReadingList,
} from "../controllers/readingListController.js";

const readingListRoute = Router();

readingListRoute
  .route("/")
  .post(isLoggedIn, addToReadingList)
  .get(isLoggedIn, viewReadingList);

readingListRoute
  .route("/remove/:itemId")
  .get(isLoggedIn, removeItemsReadingList);

export default readingListRoute;
