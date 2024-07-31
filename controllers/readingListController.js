import Books from "../models/bookModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/response.js";

// ///////////ADD TO READING LIST//////////////////
const addToReadingList = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { bookId } = req.body;

  // Validate Book
  const book = await Books.findById(bookId);
  if (!book) {
    return next(new AppError("Book does not exist", 404));
  }

  // Fetch User with Reading List IDs
  const user = await User.findById(id).select("readingList");

  // Check if Book is Already in Reading List
  const isBookInReadingList = user.readingList.some(
    (item) => item.toString() === bookId.toString()
  );
  if (isBookInReadingList) {
    return next(new AppError("Book is already in the reading list", 400));
  }

  // Add Book to Reading List
  user.readingList.push(bookId);
  await user.save();

  // Send Response
  res.status(200).json({
    success: true,
    message: "Book added to reading list",
  });
});

/////////////VIEW READING LISTS////////////////////////
const viewReadingList = catchAsync(async (req, res, next) => {});

// ///////////////REMOVE ITEMS FROM READING LISTS////////////////
const removeItemsReadingList = catchAsync(async (req, res, next) => {
  const teamId = req.params.itemId;
  const userId = req.user.id;

  const user = await User.findById(userId).populate("readingList");

  const updateReadingList = user.readingList.filter(
    (iteam) => iteam._id.toString() !== teamId
  );

  user.readingList = updateReadingList;

  if (user.readingList.length === 0) {
    await User.findByIdAndUpdate(userId, { $unset: { readingList: "" } });
  } else {
    await user.save();
  }

  // Send Response
  sendResponse(res, "Removed");
});

export { addToReadingList, viewReadingList, removeItemsReadingList };
