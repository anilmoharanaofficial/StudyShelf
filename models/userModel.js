import { Schema, model } from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requried"],
      minlength: [5, "Name must be at least 5 charchter"],
      maxlength: [50, "Name should be less that 50 charchter"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [8, "Password must be at least 8 charchter"],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    // bookCollection: {
    //   type: [Schema.Types.ObjectId],
    //   default: undefined,
    // },
    forgotPasswordToken: "String",
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Password Encryption
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

userSchema.methods = {
  // Generate JWT Token
  generateJWTToken: async function () {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );
  },
};

const User = model("User", userSchema);
export default User;
