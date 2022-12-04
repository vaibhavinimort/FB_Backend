const express = require("express");
const { register, activateAccount, login, auth, sendVerification } = require("../controllers/user");
const router = express.Router();
const { authUser } = require("../middleware/auth.js");

router.post("/register", register);
router.get("/activate/:token", authUser, activateAccount);
router.post("/login", login);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.post("/auth", authUser, auth);



module.exports = router;