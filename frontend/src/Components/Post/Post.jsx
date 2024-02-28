import React, { useEffect, useState } from "react";
import "./Post.css";
import { Button, Dialog } from "@mui/material";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
  DeleteForever,
} from "@mui/icons-material";
// import {Avatar} from "@mui/icons-material"
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deleteCommentOnPost,
  deletePost,
  likePost,
  updateMyCaption,
} from "../../Actions/Post";
import {
  getFollowingPosts,
  getMyPosts,
  getUserPosts,
  loadUser,
} from "../../Actions/User";
import User from "../User/User";
import Commentcard from "../Commentcard/Commentcard";
import { useParams } from "react-router-dom";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isAccount = false,
  isDelete = false,
  isHomePage = true,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commnetToggle, setCommnetToggle] = useState(false);
  const [captionValue, setcaptionValue] = useState(caption);
  const [captionToggle, setcaptionToggle] = useState(false);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const params = useParams();
  // console.log("isAccount", ":", isAccount)
  // console.log("isDeleted", ":", isDelete)
  // console.log("isHomepage", ":", isHomePage)
  const handlelike = async () => {
    setLiked(!liked);
    dispatch(likePost(postId));
    if (isAccount) {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts());
      if (isHomePage) {
        dispatch(getUserPosts(params.id));
      }
    }
  };
  const updateCaptionHandler = async (e) => {
    e.preventDefault();
    dispatch(updateMyCaption(captionValue, postId));
    dispatch(getMyPosts());
  };
  const addCommenthandler = async (e) => {
    // console.log("adding comment handler");
    e.preventDefault();
    dispatch(addCommentOnPost(postId, commentValue));
    if (isAccount) {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts());
      if (isHomePage) {
        dispatch(getUserPosts(params.id));
      }
    }
  };
  const deletPostHandler = async () => {
    dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(loadUser());
  };
  useEffect(() => {
    likes.forEach((item) => {
      // Check if user and item.user are not null or undefined
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  return (
    <div className="post">
      <div className="postHeader">
        {isAccount ? (
          <Button onClick={() => setcaptionToggle(!captionToggle)}>
            <MoreVert />
          </Button>
        ) : null}
      </div>
      <img
        src={postImage}
        alt="post"
        width={"500px"}
        height={"500px"}
        style={{
          objectFit: "contain",
        }}
      />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="User"
          sx={{ height: "3vmax", width: "3vmax" }}
        />
        <Link to={`/user/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>
        <Typography
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          margin: "1vmax 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length === 0 ? true : false}
      >
        <Typography>{likes.length} likes</Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handlelike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>
        <Button
          onClick={() => {
            setCommnetToggle(!commnetToggle);
          }}
        >
          <ChatBubbleOutline />
          <Typography>{comments.length}</Typography>
        </Button>
        {isDelete ? (
          <Button onClick={deletPostHandler}>
            <DeleteOutline />
          </Button>
        ) : null}
      </div>
      <Dialog
        open={likesUser}
        onClose={() => setLikesUser(!likesUser)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Likedby</Typography>
          {likes.map((like) => (
            <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
          ))}
        </div>
      </Dialog>
      <Dialog
        open={commnetToggle}
        onClose={() => setCommnetToggle(!commnetToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">comments by</Typography>
          <form
            className="commentForm"
            onSubmit={addCommenthandler}
          >
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="comments here..."
              required
            />
            <Button
              variant="contained"
              type="submit"
            >
              Add
            </Button>
          </form>
          {/* {comments && comments.length > 0 ? (
  comments.map((item) => (
    <Commentcard
      key={item._id}
      userId={item.user._id}
      name={item.user.name}
      avatar={item.user.avatar.url}
      commentId={item._id}
      postId={postId}
      comment={item.comment}
      isAccount={isAccount}
    />
  ))
) : (
  <Typography>No comments yet</Typography>
)} */}
          {comments && comments.length > 0 ? (
            comments.map((item) => (
              <Commentcard
                key={item._id}
                userId={item.user && item.user._id}
                name={item.user && item.user.name}
                avatar={item.user && item.user.avatar && item.user.avatar.url}
                commentId={item._id}
                postId={postId}
                comment={item.comment}
                isAccount={isAccount}
                isHomePage={isHomePage}
              />
            ))
          ) : (
            <Typography>No comments yet</Typography>
          )}
        </div>
      </Dialog>
      <Dialog
        open={captionToggle}
        onClose={() => setcaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">updatecaption</Typography>
          <form
            className="commentForm"
            onSubmit={updateCaptionHandler}
          >
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setcaptionValue(e.target.value)}
              placeholder="comments here..."
              required
            />
            <Button
              variant="contained"
              type="submit"
            >
              Add
            </Button>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
