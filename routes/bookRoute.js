import { Router } from "express";
import {
  deleteBook,
  publish,
  update,
  view,
} from "../controllers/bookController.js";

const bookRoute = Router();

bookRoute.route("/").post(publish).get(view);
bookRoute.route("/:id").put(update).delete(deleteBook);

export default bookRoute;
