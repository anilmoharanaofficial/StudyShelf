import { Router } from "express";
import {
  deleteBook,
  publish,
  update,
  view,
} from "../controllers/bookController.js";
import upload from "../middleware/mullter.js";

const bookRoute = Router();

const Uploadfiles = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bookFiles", maxCount: 1 },
]);

bookRoute.route("/").post(Uploadfiles, publish).get(view);
bookRoute.route("/:id").put(Uploadfiles, update).delete(deleteBook);

export default bookRoute;
