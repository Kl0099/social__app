import React, { useEffect, useState } from "react"
import "./account.css"
import { useDispatch, useSelector } from "react-redux"
import {
  LogoutUser,
  deleteMyProfile,
  getMyPosts,
  loadUser,
} from "../../Actions/User"
import Loader from "../Loader/Loader"
import Post from "../Post/Post"
import { Typography } from "@mui/material"
import { useAlert } from "react-alert"
import { Avatar } from "@mui/material"
import { Button, Dialog } from "@mui/material"
import { Link } from "react-router-dom"
import User from "../User/User"

const Account = () => {
  const dispatch = useDispatch()
  const alert = useAlert()
  const [followersToggle, setFollowersToggle] = useState(false)
  const [followingToggle, setFollowingToggle] = useState(false)
  const {
    user,
    loading: usersLoading,
    error: LoginError,
  } = useSelector((state) => state.user)
  const { loading, error, posts } = useSelector((state) => state.myPosts)
  const {
    error: LikeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like)
  // console.log(user);
  const consoll = () => {
    posts.map((post) => {
      console.log(post._id)
    })
  }
  const logoutHandler = async () => {
    await dispatch(LogoutUser())
    dispatch(loadUser())
    alert.success("logged out successfully")
  }
  const deleteProfileHandler = async () => {
    await dispatch(deleteMyProfile())
    dispatch(LogoutUser())
  }

  useEffect(() => {
    dispatch(getMyPosts())
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      console.log(error)
      alert.error(error)
      dispatch({ type: "clearError" })
    }

    if (LikeError) {
      console.log(LikeError)
      alert.error(LikeError)
      dispatch({ type: "clearError" })
    }
    if (message) {
      // alert.success(message)
      dispatch({ type: "clearMessages" })
    }
  }, [alert, LikeError, message, error, dispatch])

  return loading === true || usersLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post?._id}
              postId={post?._id}
              caption={post?.caption}
              postImage={post?.image.url}
              likes={post?.likes}
              comments={post?.comments}
              ownerImage={post?.owner.avatar.url}
              ownerName={post?.owner.name}
              ownerId={post?.owner._id}
              isAccount={true}
              isDelete={true}
            />
          ))
        ) : (
          <Typography variant="h6">You have not made any post</Typography>
        )}
      </div>
      <div className="accountright">
        {user && user.avatar && (
          <Avatar
            src={user.avatar.url}
            sx={{ height: "8vmax", width: "8vmax" }}
          />
        )}
        {user && (
          <div>
            <Typography variant="h5">{user.name}</Typography>

            <div>
              <button
                onClick={() => {
                  setFollowersToggle(!followersToggle)
                }}
              >
                Followers
              </button>
              <Typography>{user.followers.length}</Typography>
            </div>
            <div>
              <button onClick={() => setFollowingToggle(!followingToggle)}>
                Following
              </button>
              <Typography>{user.following.length}</Typography>
            </div>
            <div>
              <Typography>Posts</Typography>
              {user.posts.length}
            </div>

            <Button
              color="error"
              onClick={logoutHandler}
            >
              LogOut
            </Button>
            <Link to={"/update/profile"}>Edit profile</Link>

            {/* <Button
              color="error"
              onClick={deleteProfileHandler}
              disabled={deleteLoading}
            >
              Delete my profile
            </Button> */}
          </div>
        )}
      </div>
      <Dialog
        open={followingToggle}
        onClose={() => setFollowingToggle(!followingToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Followings</Typography>
          {user && user.following.length > 0 ? (
            user.following.map((follow) => (
              <User
                key={follow._id}
                userId={follow._id}
                name={follow.name}
                avatar={follow.avatar.url}
              />
            ))
          ) : (
            <Typography>you are not following anyone</Typography>
          )}
        </div>
      </Dialog>
      <Dialog
        open={followersToggle}
        onClose={() => setFollowersToggle(!followersToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Followers</Typography>
          {user && user.followers.length > 0 ? (
            user.followers.map((follower) => (
              <User
                key={follower._id}
                userId={follower._id}
                name={follower.name}
                avatar={follower.avatar.url}
              />
            ))
          ) : (
            <Typography>you have no followers</Typography>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default Account
