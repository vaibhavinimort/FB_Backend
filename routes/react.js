const express = require("express");
const { reactPost, getReacts } = require("../controllers/react");
const router = express.Router();
const { authUser } = require("../middleware/auth.js");




router.put("/reactPost", authUser, reactPost);
router.put("/getReacts", authUser, getReacts);

module.exports = router;