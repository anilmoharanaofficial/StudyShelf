import JWT from "jsonwebtoken";
import AppError from "../utils/AppError.js";

// const isLoggedIn = async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     // return next(new AppError("Unauthonticated, Please Login Again", 400));
//     req.session.returnTo = req.originalUrl; // Store the original requested URL in the session
//     return res.redirect("/login");
//   }

//   const userDetails = await JWT.verify(token, process.env.JWT_SECRET);

//   req.user = userDetails;

//   next();
// };

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    const clientUrl = req.get("Referer");
    req.session.returnTo = clientUrl || "/";
    return res.status(500).json({
      success: false,
      message: "Unauthonticated, Please Login",
      redirect: "/login",
    });
  }

  try {
    const userDetails = await JWT.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
      redirect: "/login",
    });
  }
};

export { isLoggedIn };
