import { Schema, model } from "mongoose";
import slugify from "slugify";

const bookSchema = new Schema(
  {
    bookName: {
      type: String,
      required: [true, "Book Name Must Be Required"],
      unique: true,
      trim: true,
      minlength: [10, "Book Name must be at least 10 characters"],
      maxlength: [60, "Book Name should be less than 60 characters"],
    },
    description: {
      type: String,
      required: [true, "Description Must Be Required"],
      trim: true,
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [200, "Description should be less than 200 characters"],
    },
    publisher: {
      type: String,
      required: [true, "publisher is required"],
    },
    className: {
      type: String,
      required: [true, "Class Must Be Required"],
    },
    coverImage: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    bookFiles: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    moreDetails: {
      language: {
        type: String,
        required: [true, "Language Is Required"],
      },
      publishYear: {
        type: String,
        required: [true, "Publish Year is Required"],
      },
    },
    slug: String,
    createdBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", function (next) {
  const specialCharsRegex = /[*+~.()'"!:@]/g;
  const sanitizedbookName = this.bookName.replace(specialCharsRegex, "");
  this.slug = slugify(sanitizedbookName, { lower: true });
  next();
});

const Books = model("Books", bookSchema);

export default Books;
