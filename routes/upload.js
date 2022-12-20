const express = require("express");
const { uploadImages } = require("../controllers/upload");
const { authUser } = require("../middleware/auth.js");
const imageUpload = require("../middleware/imageUpload");

const router = express.Router();


router.post("/uploadImages", imageUpload, uploadImages);

module.exports = router;