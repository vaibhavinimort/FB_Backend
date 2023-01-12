const express = require("express");
const { uploadImages, listImages } = require("../controllers/upload");
const { authUser } = require("../middleware/auth.js");
const imageUpload = require("../middleware/imageUpload");

const router = express.Router();



router.post("/uploadImages", authUser, imageUpload, uploadImages);
router.get("/listImages", listImages);

module.exports = router;