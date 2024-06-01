import Books from "../models/bookModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/response.js";

// PUBLISH BOOK
const publish = catchAsync(async (req, res, next) => {
  const { bookName, description, category } = req.body;

  if (!bookName || !description || !category) {
    return next(new AppError("All Fields Are Required", 500));
  }

  const existingBook = await Books.findOne({ bookName });
  if (existingBook) {
    return next(new AppError("Book Already Exists", 500));
  }

  const newbook = await Books.create({
    bookName,
    description,
    category,
  });

  await newbook.save();

  // Send Response
  sendResponse(res, "Book Has Been Successfully Published", newbook);
});

// VIEW
const view = catchAsync(async (req, res, next) => {});

// UPDATE
const update = catchAsync(async (req, res, next) => {});

// DELETE
const deleteBook = catchAsync(async (req, res, next) => {});

export { publish, view, update, deleteBook };
