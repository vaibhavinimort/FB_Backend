const express = require("express");
const { register, activateAccount, login, auth, sendVerification, activateEmail } = require("../controllers/user");
const router = express.Router();
const { authUser } = require("../middleware/auth.js");

router.post("/register", register);
router.post("/activate/", authUser, activateAccount);
router.get("/activate/:token", activateEmail);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.post("/auth", authUser, () => console.log('Auth'));



module.exports = router;