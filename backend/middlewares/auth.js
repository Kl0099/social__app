const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { WrapAsync } = require("../utility/WrapAsync");

exports.isAuthenticated = WrapAsync(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: "please login first",
    });
  }
  const decoded = jwt.verify(token, process.env.SECRET_JWT);
  req.user = await User.findById(decoded._id);
  next();
});
