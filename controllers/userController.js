import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import isValidEmail from "../utils/isValidEmail.js";
import sendResponse from "../utils/response.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import fs from "fs";
// import sendEmail from "../utils/sendMail.js";

// Cookie Options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7 Days
  httpOnly: true,
  secure: true,
};

// ////////////SIGNUP//////////////
const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check for required fiels
  if (!name || !email || !password) {
    return next(new AppError("All Fields Are Required", 500));
  }

  // Check for valid email address
  if (!isValidEmail(email)) {
    return next(new AppError("Please Enter A Valid Email Address", 500));
  }

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 500));
  }

  // Create New User Instance
  const newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "default_Avatar",
      secure_url:
        "https://res.cloudinary.com/drx2gahpl/image/upload/v1717342329/Learnodisha/Avatars/tnpwgw5zdvdstyuygamd.png",
    },
  });

  if (!newUser) {
    return next(new AppError("User Registration Failed", 500));
  }

  // Save New User
  await newUser.save();
  newUser.password = undefined;

  // Set Cookies
  const token = await newUser.generateJWTToken();
  res.cookie("token", token, cookieOptions);

  // Send Response
  sendResponse(res, "User Signing Up Successfully", newUser);
});

// ///////////LOGIN////////////////
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for required feilds
  if (!email || !password) {
    return next(new AppError("All Feilds Are Required", 500));
  }

  // Check for vaild user
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Email And Password Dose Not Match", 500));
  }

  // Set Cookies
  const token = await user.generateJWTToken();
  user.password = undefined;
  res.cookie("token", token, cookieOptions);

  // Send response
  sendResponse(res, "User Loggedin Successfully", user);
});

//////////////LOGOUT//////////////////
const logout = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  // Send response
  sendResponse(res, "User Logged Out Successfully");
});

// ///////////PROFILE/////////////////////
const profile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User not found", 500));
  }

  // Send Response
  sendResponse(res, "User Details", user);
});

/////////////UPDATE PROFILE/////////////////
const update = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  // Check for existing user
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User Not Found", 500));
  }

  // Update Profile
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }

  // Chnage User Avatar / Profile Pic
  if (req.files) {
    if (req.files.avatar) {
      const avatarDetails = await cloudinary.v2.uploader.upload(
        req.files.avatar[0].path,
        {
          folder: "learnodisha/Avatars",
          use_filename: true,
        }
      );

      if (avatarDetails) {
        user.avatar.public_id = avatarDetails.public_id;
        user.avatar.secure_url = avatarDetails.secure_url;

        // Remove Avataa From Local Foloder
        if (fs.existsSync(`uploads/${req.files.avatar[0].filename}`)) {
          fs.rmSync(`uploads/${req.files.avatar[0].filename}`);
        }
      } else {
        throw new AppError("File upload for Cover Image failed", 500);
      }
    }
  }

  // Save User Details
  await user.save();

  // Send response
  sendResponse(res, "User Details Updated Successfully", user);
});

////////////////DELETE ACCOUNT//////////////////
const deleteAccount = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Delete user account
  const user = await User.findByIdAndDelete(userId).populate("avatar");
  if (!user) {
    return next(new AppError("User Not Found", 500));
  }

  // Delete Avatar
  const avatar = user.avatar.public_id;

  if (avatar === "default_Avatar") {
    next();
  } else {
    await cloudinary.v2.api.delete_resources([avatar], {
      type: "upload",
      resource_type: "image",
    });
  }

  // Remove Cookie
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  // Send response
  sendResponse(res, "User Account Deleted Successfully", user);
});

// /////////////CHANGE PASSWORD////////////////////
const changePassword = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { password, newPassword } = req.body;

  // Check for required feilds
  if (!password || !newPassword) {
    return next(new AppError("All Feilds Are Required", 500));
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    return next(new AppError("User Dose Not Exists", 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError("Invalid Old Password", 400));
  }

  user.password = newPassword;
  await user.save();

  user.password = undefined;

  sendResponse(res, "User Password Chnaged Successfully", user);
});

/////////////FORGOT PASSWORD//////////////////////
const forgotPassword = catchAsync(async (req, res, next) => {});

////////////////RESET PASSWORD//////////////////
const resetPassword = catchAsync(async (req, res, next) => {});

export {
  signup,
  login,
  logout,
  profile,
  update,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
};
