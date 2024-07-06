import Books from "../models/bookModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/response.js";
import cloudinary from "cloudinary";
import fs from "fs";
import filters from "../utils/filters.js";

////////////////// PUBLISH BOOK//////////////////
const publish = catchAsync(async (req, res, next) => {
  const {
    bookName,
    description,
    publisher,
    className,
    language,
    publishYear,
    category,
  } = req.body;

  const userId = req.user.id;
  const user = await User.findById(userId);

  // Check for required fields
  if (!bookName || !description || !publisher || !className || !category) {
    return next(new AppError("All fields are required", 400));
  }

  // Check if the book already exists
  const existingBook = await Books.findOne({ bookName });
  if (existingBook) {
    return next(new AppError("Book already exists", 400));
  }

  // Create a new book instance
  const newBook = new Books({
    bookName,
    description,
    publisher,
    className,
    category,
    coverImage: {
      public_id: "Dummy",
      secure_url: "Dummy",
    },
    bookFiles: {
      public_id: "Dummy",
      secure_url: "Dummy",
    },
    moreDetails: { language, publishYear },
    createdBy: user,
  });

  // Upload Files
  if (req.files) {
    // Upload CoverImage
    if (req.files.coverImage) {
      const coverImageResult = await cloudinary.v2.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "learnodisha/Cover Images",
          use_filename: true,
        }
      );

      if (coverImageResult) {
        newBook.coverImage.public_id = coverImageResult.public_id;
        newBook.coverImage.secure_url = coverImageResult.secure_url;

        // Remove file from local server
        if (fs.existsSync(`uploads/${req.files.coverImage[0].filename}`)) {
          fs.rmSync(`uploads/${req.files.coverImage[0].filename}`);
        }
      } else {
        throw new AppError("File upload for Cover Image failed", 500);
      }
    }

    // Upload Book File (PDF/DOC/ZIP)
    if (req.files.bookFiles) {
      const bookFilesDetails = await cloudinary.v2.uploader.upload(
        req.files.bookFiles[0].path,
        {
          folder: "learnodisha/Book Files",
          resource_type: "raw",
          use_filename: true,
        }
      );

      if (bookFilesDetails) {
        newBook.bookFiles.public_id = bookFilesDetails.public_id;
        newBook.bookFiles.secure_url = bookFilesDetails.secure_url;
        // Remove file from local server
        if (fs.existsSync(`uploads/${req.files.bookFiles[0].filename}`)) {
          fs.rmSync(`uploads/${req.files.bookFiles[0].filename}`);
        }
      } else {
        throw new AppError("File upload for Cover Image failed", 500);
      }
    }
  }

  // Save the new book
  await newBook.save();

  // Send response
  sendResponse(
    res,
    "Book has been successfully published",
    newBook,
    "/dashboard/books"
  );
});

///////////////////////// VIEW ALL BOOKS////////////////////////////
const view = catchAsync(async (req, res, next) => {
  const filter = new filters(Books.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate("createdBy", "name avatar");

  const books = await filter.query;

  // Send Response
  sendResponse(res, "All Books", books);
});

//////////////////////VIEW SINGLE BOOK//////////////////////////////
const viewBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await Books.findById(id);

  if (!book) {
    return next(AppError("Books Doesn't Exist", 500));
  }

  //Send Response
  sendResponse(res, "Book", book);
});

////////////////VIEW BOOK BY SLUG///////////////
const viewBookByslug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const book = await Books.findOne({ slug });

  if (!book) {
    return next(new AppError("Book doesn't exist", 404));
  }

  // Send response
  sendResponse(res, "Book", book);
});

/////////////////////////////// UPDATE////////////////////////////////
const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let book = await Books.findById(id);

  if (!book) {
    return next(new AppError("Book Does Not Exist", 404));
  }

  // Update document fields from req.body
  Object.assign(book, req.body);

  // Update Media Files (Images/PDF/Zip)
  if (req.files) {
    // Upload CoverImage
    if (req.files.coverImage) {
      const coverImageResult = await cloudinary.v2.uploader.upload(
        req.files.coverImage[0].path,
        {
          folder: "learnodisha/Cover Images",
          use_filename: true,
        }
      );

      if (coverImageResult) {
        // Delete Previous Image
        if (book.coverImage && book.coverImage.public_id) {
          await cloudinary.v2.uploader.destroy(book.coverImage.public_id, {
            type: "upload",
            resource_type: "image",
          });
        }

        // Update New Image Details in Database
        book.coverImage = {
          public_id: coverImageResult.public_id,
          secure_url: coverImageResult.secure_url,
        };

        // Remove file from local server
        if (fs.existsSync(`uploads/${req.files.coverImage[0].filename}`)) {
          fs.rmSync(`uploads/${req.files.coverImage[0].filename}`);
        }
      } else {
        throw new AppError("File upload for Cover Image failed", 500);
      }
    }

    // Upload Book File (PDF/DOC/ZIP)
    if (req.files.bookFiles) {
      const bookFilesDetails = await cloudinary.v2.uploader.upload(
        req.files.bookFiles[0].path,
        {
          folder: "learnodisha/Book Files",
          resource_type: "raw",
          use_filename: true,
        }
      );

      if (bookFilesDetails) {
        // Delete Previous File
        if (book.bookFiles && book.bookFiles.public_id) {
          await cloudinary.v2.uploader.destroy(book.bookFiles.public_id, {
            type: "upload",
            resource_type: "raw",
          });
        }

        // Update New File Details in Database
        book.bookFiles = {
          public_id: bookFilesDetails.public_id,
          secure_url: bookFilesDetails.secure_url,
        };

        // Remove file from local server
        if (fs.existsSync(`uploads/${req.files.bookFiles[0].filename}`)) {
          fs.rmSync(`uploads/${req.files.bookFiles[0].filename}`);
        }
      } else {
        throw new AppError("File upload for Book Files failed", 500);
      }
    }
  }

  await book.save();

  // Send Response
  sendResponse(res, "Book Has Been Successfully Updated", book);
});

////////////////////////// DELETE////////////////////////////////////////
const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Dlete Book Data From Database
  const book = await Books.findByIdAndDelete(id).populate(
    "coverImage",
    "bookFiles"
  );
  if (!book) {
    return next(new AppError("Product with given Id dose not exist", 500));
  }

  // Delete Media From Cloud
  const coverImage = book.coverImage.public_id;
  const bookFiles = book.bookFiles.public_id;

  if (coverImage) {
    await cloudinary.v2.api.delete_resources([coverImage], {
      type: "upload",
      resource_type: "image",
    });
  }

  if (bookFiles) {
    await cloudinary.v2.api.delete_resources([bookFiles], {
      type: "upload",
      resource_type: "raw",
    });
  }

  // Send Response
  sendResponse(res, "Successfully Deleted", book);
});

export { publish, view, viewBook, update, deleteBook, viewBookByslug };
