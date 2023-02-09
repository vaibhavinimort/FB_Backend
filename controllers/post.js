const Post = require("../models/Post");
const { populate } = require("../models/User");
const User = require("../models/User")


exports.createPost = async(req, res) => {
    try {
        const post = await new Post(req.body).save();
        await post.populate("user", "first_name last_name cover picture usename")
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getAllPosts = async(req, res) => {
    try {
        const followingTemp = await User.findById(req.user.id).select("following");
        const following = followingTemp.following
        const promises = following.map((user) => {
            return Post.find({ user: user })
                .populate("user")
                .populate("comments.commentBy", "first_name last_name picture username")
                .sort({ createdAt: -1 })
                .limit(10);
        });
        const followingPosts = await (await Promise.all(promises)).flat();
        const userPosts = await Post.find({ user: req.user.id })
            .populate("user", "first_name last_name picture username")
            .populate("comments.commentBy", "first_name last_name picture username")
            .sort({ createdAt: -1 })
            .limit(10);
        followingPosts.push(...[...userPosts]);
        followingPosts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });
        res.json(followingPosts);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.comment = async(req, res) => {
    try {
        const { comment, image, postId } = req.body;
        let newComments = await Post.findByIdAndUpdate(
            postId, {
                $push: {
                    comments: {
                        comment: comment,
                        image: image,
                        commentBy: req.user.id,
                        commentAt: new Date(),
                    },
                },
            }, {
                new: true,
            }
        ).populate("comments.commentBy ")
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.savePost = async(req, res) => {
    try {
        const postId = req.params.id;
        const user = await User.findById(req.user.id);
        const check = user.savePost.find(
            (post) => post.post.toString() == postId);
        if (check) {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    savedPost: {
                        post: postId,
                        _id: check._id
                    },
                },
            });
        } else {
            await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    savedPost: {
                        post: postId,
                        savedAt: new Date(),
                    },
                },
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


exports.deletePost = async(req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.id);
        res.json({ status: "ok" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}