import Books from "../models/bookModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/response.js";

// ///////////ADD TO READING LIST//////////////////
const addToReadingList = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const userId = req.user.id;

  // Check for valid item id
  const item = await Books.findById(id);

  if (!item) {
    return next(new AppError("item Not Found", 500));
  }

  //Check for if iteam already exists in reading list
  const user = await User.findById(userId).populate("readingList");

  // if (user.readingList.includes(item.id)) {
  //   return next(new AppError("Item Already Exists in Reading List", 500));
  // } else {
  //   next();
  // }

  // Add items to reading collections
  user.readingList = item.id;

  // Save User Deatils
  await user.save();

  // Send Response
  sendResponse(res, "Item Successfully Added To Reading List.", item);
});

/////////////VIEW READING LISTS////////////////////////
const viewReadingList = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate("readingList");

  if (!user) {
    return next(new AppError("User not found", 500));
  }

  const readingList = user.readingList;

  if (readingList) {
    const getAllItemDetails = readingList.map(async (item) => {
      const detailedItem = await Books.findById(item._id);
      return {
        itemId: item._id,
        itemName: detailedItem.bookName,
        category: detailedItem.category,
      };
    });
    const iteamDetails = await Promise.all(getAllItemDetails);

    return res.status(200).json({
      success: true,
      message: "All Items in Your Reading List",
      result: iteamDetails.length,
      items: iteamDetails,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Your reading list is empty!",
    });
  }
});

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
  sendResponse(res, "Product removed from cart successfully.", user);
});

export { addToReadingList, viewReadingList, removeItemsReadingList };
