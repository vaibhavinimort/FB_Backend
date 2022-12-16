const express = require("express");
const { createPost } = require("../controllers/post");
const router = express.Router();
const { authUser } = require("../middleware/auth ");

router.post("/createPost", authUser, createPost);


module.exports = router;