const express = require("express");
const { createPost, getAllPosts } = require("../controllers/post");
const router = express.Router();
const { authUser } = require("../middleware/auth.js");

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", getAllPosts);



module.exports = router;