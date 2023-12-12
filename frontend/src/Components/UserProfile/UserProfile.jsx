import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import {
  LogoutUser,
  deleteMyProfile,
  followAndUnfollowUser,
  getMyPosts,
  getUserPosts,
  getUserProfile,
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

const UserProfile = () => {
  const dispatch = useDispatch()
  const alert = useAlert()
  const [followersToggle, setFollowersToggle] = useState(false)
  const [followingToggle, setFollowingToggle] = useState(false)
  const [following, setFollowing] = useState(false)
  const [myProfile, setmyProfile] = useState(false)
  const params = useParams()
  const isHomePage = true

  const {
    user,
    loading: usersLoading,
    error: userError,
  } = useSelector((state) => state.userProfile)
  const { user: me } = useSelector((state) => state.user)
  const { loading, error, posts } = useSelector((state) => state.userPosts)
  const {
    error: followError,
    message: followMessage,
    loading: followLoading,
  } = useSelector((state) => state.like)

  const {
    error: LikeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like)
  const followHandler = async () => {
    setFollowing(!following)
    await dispatch(followAndUnfollowUser(user._id))
    dispatch(getUserProfile(params.id))
  }

  useEffect(() => {
    dispatch(getUserPosts(params.id))
    dispatch(getUserProfile(params.id))
    if (isHomePage) {
      dispatch(getUserPosts(params.id))
    }
  }, [dispatch, params.id])

  useEffect(() => {
    if (me._id === params.id) {
      setmyProfile(true)
    }
    if (user) {
      user.followers.forEach((follow) => {
        if (follow._id === me._id) {
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      })
    }
  }, [user, params.id, me._id])

  useEffect(() => {
    if (error) {
      console.log(error)
      alert.error(error)
      dispatch({ type: "clearError" })
    }
    if (followError) {
      alert.error(followError)
      dispatch({ type: "clearError" })
    }
    if (userError) {
      alert.error(userError)
      dispatch({ type: "clearError" })
    }
    if (LikeError) {
      console.log(LikeError)
      alert.error(LikeError)
      dispatch({ type: "clearError" })
    }
    if (message) {
      alert.success(message)
      // console.log("UserProfilepage ", ": ", message)
      dispatch({ type: "clearMessages" })
    }
  }, [alert, LikeError, message, error, followError, userError, dispatch])

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
              isHomePage={isHomePage}
            />
          ))
        ) : (
          <Typography variant="h6">user has not made any post</Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <div>
            <Avatar
              src={user && user.avatar.url}
              sx={{ height: "8vmax", width: "8vmax" }}
            />

            <div>
              <Typography variant="h5">{user && user.name}</Typography>
              <Typography>
                <div>
                  <button
                    onClick={() => {
                      setFollowersToggle(!followersToggle)
                    }}
                  >
                    <Typography>Followers</Typography>
                  </button>
                  <Typography>{user && user.followers.length}</Typography>
                </div>
                <div>
                  <button onClick={() => setFollowingToggle(!followingToggle)}>
                    <Typography>Following</Typography>
                  </button>
                  <Typography>{user && user.following.length}</Typography>
                </div>
                <div>
                  <Typography>Posts</Typography>
                  {user.posts.length}
                </div>
              </Typography>
              {myProfile ? null : (
                <Button
                  disabled={followLoading}
                  onClick={followHandler}
                  style={{
                    backgroundColor: following ? "red" : "green",
                    color: "white",
                  }}
                >
                  {following ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
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
            <Typography style={{ margin: "2vmax" }}>
              not following anyone
            </Typography>
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
            <Typography>user doesn`t have any followers</Typography>
          )}
        </div>
      </Dialog>
    </div>
  )
}

export default UserProfile
