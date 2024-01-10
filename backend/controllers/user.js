const User = require("../models/User")
const Post = require("../models/Post")

const cloudinary = require("cloudinary")
const { WrapAsync } = require("../utility/WrapAsync")

exports.register = WrapAsync(async (req, res) => {
  const { name, email, password, avatar } = req.body
  let user = await User.findOne({ email })
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "user is already exists" })
  }

  const mycloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "socialapp_avatars",
  })

  user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: mycloud.public_id, url: mycloud.url },
  })
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  const token = await user.ganerateToken()
  res.status(201).cookie("token", token, options).json({
    success: true,
    user,
    token,
    message: "successfully registered",
  })
})


exports.login = WrapAsync(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
    .maxTimeMS(15000)
    .select("+password")
    .populate("posts followers following")
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User is not exist",
    })
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "incorrect password",
    })
  }
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
  const token = await user.ganerateToken()
  res.status(200).cookie("token", token, options).json({
    success: true,
    user,
    token,
  })
})


exports.logOut = WrapAsync(async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    })
})



exports.followUser = WrapAsync(async (req, res) => {
  const userToFollow = await User.findById(req.params.id)
  const loggedUser = await User.findById(req.user._id)

  if (!userToFollow) {
    return res.staus(404).json({
      success: false,
      message: "user not found",
    })
  }
  if (loggedUser.following.includes(userToFollow._id)) {
    //if user already follows this user then simple unfollow them
    const indexFollowing = loggedUser.following.indexOf(userToFollow._id)
    loggedUser.following.splice(indexFollowing, 1)

    const indexFollowers = userToFollow.followers.indexOf(loggedUser._id)
    userToFollow.followers.splice(indexFollowers, 1)

    await loggedUser.save()
    await userToFollow.save()

    res.status(200).json({
      success: "true",
      message: "successfully unfollowed",
    })
  } else {
    loggedUser.following.push(userToFollow._id)
    userToFollow.followers.push(loggedUser._id)

    await loggedUser.save()
    await userToFollow.save()
    res.status(200).json({
      success: "true",
      message: "successfully followed",
    })
  }
})

exports.updateProfile = WrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
  const { name, email, avatar } = req.body
  if (email) {
    user.email = email
  }
  if (name) {
    user.name = name
  }
  if (avatar) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    const mycloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "socialapp_avatars",
    })
    user.avatar.public_id = mycloud.public_id
    user.avatar.url = mycloud.url
  }
  await user.save()
  res.status(200).json({
    success: true,
    message: "profile updated successfully",
  })
})

exports.deleteMyProfile = WrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
  const posts = user.posts
  const followers = user.followers
  const following = user.following
  const userId = user._id

  //cloudinary remove avatar
  await cloudinary.v2.uploader.destroy(user.avatar.public_id)

  //remove post
  for (let i = 0; i < posts.length; i++) {
    const post = await Post.findById(posts[i])
    await cloudinary.v2.uploader.destroy(post.image.public._id)
    await post.deleteOne()
  }

  // console.log(post)
  await user.deleteOne()
  //logout userr after deleted user
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  // console.log(res.cookie)

  //removing userr from folllowing
  for (let i = 0; i < followers.length; i++) {
    const follower = await User.findById(followers[i])
    const index = follower.following.indexOf(userId)
    follower.following.splice(index, 1)
    await follower.save()
  }
  //removing userr from follower
  for (let i = 0; i < following.length; i++) {
    const follows = await User.findById(following[i])
    const index = follows.followers.indexOf(userId)
    follows.followers.splice(index, 1)
    await follows.save()
  }
  //removing comments
  const allposts = await Post.find()
  for (let i = 0; i < allposts.length; i++) {
    const post = await Post.findById(allposts[i]._id)
    for (let j = 0; j < post.comments.length; j++) {
      if (post.comments[j].user === userId) {
        post.comments.splice(j, 1)
      }
    }
    if (post.likes.length > 0) {
      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1)
        }
      }
    }
    await post.save()
  }

  res.status(200).json({
    success: true,
    message: "profile deleted successfully",
  })
})


exports.myprofile = WrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "posts followers following"
  )
  res.status(200).json({
    success: true,
    user,
  })
})


exports.getUserProfile = WrapAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    "posts followers following"
  )
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }
  res.status(200).json({
    success: true,
    user,
  })

})

exports.getAllUser = WrapAsync(async (req, res) => {
  const users = await User.find({
    name: { $regex: req.query.name, $options: "i" },
  })

  res.status(200).json({
    success: true,
    users,
  })
})

exports.getMyPosts = WrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
  const posts = []
  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i])
      .populate("likes")
      .populate("comments.user")
      .populate("owner")
    posts.push(post)
  }

  res.status(200).json({
    success: true,
    posts,
  })
})

exports.getUserPosts = WrapAsync(async (req, res) => {
  const user = await User.findById(req.params.id)
  const posts = []
  for (let i = 0; i < user.posts.length; i++) {
    const post = await Post.findById(user.posts[i])
      .populate("likes")
      .populate("comments.user")
      .populate("owner")
    posts.push(post)
  }

  res.status(200).json({
    success: true,
    posts,
  })
})

