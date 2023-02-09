const { file } = require("googleapis/build/src/apis/file");

module.exports = async function(req, res, next) {
    try {
        const { files } = req.body;

        if (!files || Object.values(files).flat().length === 0) {
            return res.status(400).json({ message: "no file selected." });
        }
        // let files = Object.values(req.files).flat();
        files.forEach((file) => {
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/gif" &&
                file.mimetype !== "image/webp"

            ) {
                removeTmp(file.tempFilePath);
                return res.status(400).json({ message: "Unsupported format" })
            }
            if (file.size > 1024 * 1024 * 5) {
                removeTmp(file.tempFilePath);
                return res.status(400).json({ message: "File size is too large" });
            }
        });
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};