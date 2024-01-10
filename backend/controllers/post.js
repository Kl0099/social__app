
const Post = require("../models/Post");
const User = require('../models/User');
const cloudinary = require('cloudinary');
const { WrapAsync } = require("../utility/WrapAsync");



exports.createPost = WrapAsync(async (req, res) => {
    const mycloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "socialapp_posts"
    })
    const newPostData = {
        caption: req.body.caption,
        image: {
            public_id: mycloud.public_id,
            url: mycloud.url,
        },
        owner: req.user.id,
    }

    const post = await Post.create(newPostData);
    const user = await User.findById(req.user._id);
    user.posts.unshift(post._id);
    await user.save();
    res.status(201).json({
        success: true,
        message: "Post created successfully"
    });

})

exports.likeAndDisLike = WrapAsync(async (req, res) => {

    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ success: false, message: "post not found" });
    }
    if (post.likes.includes(req.user.id)) {
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index, 1);
        // console.log(req.params.id , " " , index);
        await post.save();

        res.status(200).json({ success: true, message: "post unliked" });
    } else {
        post.likes.push(req.user._id);
        await post.save();
        res.status(200).json({ success: true, message: "post liked" });
        // console.log(post.likes);
    }
})


exports.deletePost = WrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    // console.log(post)
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: "unathorised" })
    }


    const user = await User.findById(req.user._id);
    const index = await user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();
    await cloudinary.v2.uploader.destroy(post.image.public_id);
    await post.deleteOne();
    res.status(201).json({
        success: true,
        message: "Post deleted successfully"
    })
})


exports.getPostOfFollowing = WrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({
        owner: {
            $in: user.following,
        }
    }).populate("owner likes comments.user")
    res.status(200).json({
        success: true, message: "Post found successfully",
        posts: posts.reverse(),
    })
})

exports.updateCaption = WrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(404).json({ success: false, message: "unAuthorized" });
    }
    const caption = req.body.caption;
    post.caption = caption;
    await post.save();
    console.log(post.caption);
    res.status(200).json({ success: true, message: "Post updated successfully", post })
})

exports.addComment = WrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }

    let indexofComment = -1;

    post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
            indexofComment = index;
        }
    });

    if (indexofComment !== -1) {
        // Check if req.body.comment is provided before updating
        if (req.body.comment) {
            post.comments[indexofComment].comment = req.body.comment;
            await post.save();
            res.status(200).json({ success: true, message: "Comment updated successfully" });
        } else {
            res.status(400).json({ success: false, message: "Comment is required for update" });
        }
    } else {
        // Check if req.body.comment is provided before adding a new comment
        if (req.body.comment) {
            post.comments.push({
                user: req.user.id,
                comment: req.body.comment,
            });
            await post.save();
            res.status(200).json({ success: true, message: "Comment successfully added" });
        } else {
            res.status(400).json({ success: false, message: "Comment is required for adding a new comment" });
        }
    }
})


exports.deleteComment = WrapAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    // console.log(req.body)
    // console.log(post.comments)
    if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.owner.toString() === req.user._id.toString()) {
        post.comments.forEach((item, index) => {
            if (item._id.toString() === req.body.commentId.toString()) {
                return post.comments.splice(index, 1);
            }
        });
        await post.save();

        res.status(200).json({
            success: true,
            message: "selected comment deleted "
        })
    } else {
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                return post.comments.splice(index, 1);
            }
        });
        await post.save();

        res.status(200).json({
            success: true,
            message: "comment deleted successfully"
        })
    }

})