const express = require("express");
const {
  register,
  login,
  followUser,
  logOut,
  updateProfile,
  myprofile,
  getUserProfile,
  getAllUser,
  getMyPosts,
  getUserPosts,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();
router.route("/getreq").get((req, res) => {
  res.json({
    success: true,
    message: "working...",
  });
});
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logOut);

router.route("/follow/:id").get(isAuthenticated, followUser);
router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/me").get(isAuthenticated, myprofile);
router.route("/my/posts").get(isAuthenticated, getMyPosts);
router.route("/userposts/:id").get(isAuthenticated, getUserPosts);
router.route("/user/:id").get(isAuthenticated, getUserProfile);
router.route("/users").get(isAuthenticated, getAllUser);

module.exports = router;
