import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  login,
  logout,
  profile,
  resetPassword,
  signup,
  update,
} from "../controllers/userController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/mullter.js";

const userRoute = Router();

const setAvatar = upload.fields([{ name: "avatar", maxCount: 1 }]);

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.get("/logout", logout);
userRoute.get("/profile", isLoggedIn, profile);
userRoute.post("/forgot", forgotPassword);
userRoute.post("/reset/:resetToken", resetPassword);
userRoute.post("/change-password", isLoggedIn, changePassword);
userRoute.put("/update-profile", isLoggedIn, setAvatar, update);
userRoute.delete("/delete", isLoggedIn, deleteAccount);

export default userRoute;
