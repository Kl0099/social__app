import React from "react"
import "./Commentcard.css"
import { Link } from "react-router-dom"
import { Typography, Avatar } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { deleteCommentOnPost } from "../../Actions/Post"
import { getFollowingPosts, getMyPosts, getUserPosts } from "../../Actions/User"
import { useParams } from "react-router-dom"

const Commentcard = ({
  userId,
  name,
  avatar,
  commentId,
  postId,
  comment,
  isAccount,
  isHomePage,
}) => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const params = useParams()
  const deleteCommentHandler = async () => {
    await dispatch(deleteCommentOnPost(postId, commentId))
    if (isAccount) {
      dispatch(getMyPosts())
    } else {
      await dispatch(getFollowingPosts())
      if (isHomePage) {
        dispatch(getUserPosts(params.id))
      }
    }
  }

  return (
    <div className="commentUser">
      <Link to={`/user/${userId}`}>
        <Avatar
          src={avatar}
          alt={name}
        />
        <Typography style={{ minWidth: "6vmax", padding: "10px" }}>
          {name}
        </Typography>
      </Link>
      <Typography>{comment}</Typography>
      {isAccount ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : userId === user._id ? (
        <Button onClick={deleteCommentHandler}>
          <Delete />
        </Button>
      ) : null}
    </div>
  )
}

export default Commentcard
