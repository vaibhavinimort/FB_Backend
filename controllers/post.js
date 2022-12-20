const { post } = require("../routes/post")

exports.createPost = async(req, res) => {
    try {
        const post = await new post(teq.body).save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}