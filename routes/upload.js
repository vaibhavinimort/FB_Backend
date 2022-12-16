const express = require("express");
const { uploadImages } = require("../controllers/upload");
const { authUser } = require("../middleware/auth");

const router = express.Router();


router.post("/uploadImages", uploadImages);

module.exports = router;