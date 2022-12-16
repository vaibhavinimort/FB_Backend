const { upload } = require("../routes/upload");

exports.uploadImages = async(req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}