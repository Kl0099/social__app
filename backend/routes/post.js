const express = require('express');
const {createPost, likeAndDisLike, deletePost, getPostOfFollowing, updateCaption, addComment, deleteComment} = require("../controllers/post");
const { isAuthenticated } = require('../middlewares/auth');

// const router = express.router();
const router = express.Router();

router.route("/post/upload").post(
isAuthenticated,
createPost);

router.route("/post/:id").get(isAuthenticated,likeAndDisLike)
.put(isAuthenticated,updateCaption)
.delete(isAuthenticated,deletePost)

router.route("/post").get(isAuthenticated,getPostOfFollowing);
router.route("/post/comment/:id").put(isAuthenticated,addComment).delete(isAuthenticated,deleteComment)

module.exports = router;