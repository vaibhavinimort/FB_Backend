const express = require("express");
const {
    register,
    activateAccount,
    login,
    auth,
    sendVerification,
    activateEmail,
    findUser,
    sendResetPasswordCode,
    validateResetCode,
    changePassword,
    getProfile,
    updateProfilePicture,
    updateCover,
    updateDetails,
    addFriend,
    cancelRequest,
    follow,
    unfollow,
    acceptRequest,
    unfriend,
    deleteRequest
} = require("../controllers/user");
const router = express.Router();
const { authUser } = require("../middleware/auth.js");
const User = require("../models/User");

router.post("/register", register);
router.post("/activate/", authUser, activateAccount);
router.get("/activate/:token", activateEmail);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.post("/auth", authUser, () => console.log('Auth'));
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);
router.get("/getProfile/:username", authUser, getProfile);
router.put("/updateProfilePicture/", authUser, updateProfilePicture);
router.put("/updateCover", authUser, updateCover);
router.put("/updateDetails", authUser, updateDetails);
router.put("/addFriends/:id", authUser, addFriend);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);
router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/unfriend/:id", authUser, unfriend);
router.put("/deleteRequest/:id", authUser, deleteRequest);




// router.get("/user/:id/:name", async(req, res) => {
//     // URL '/'      => req.params
//     // URL after ?  => req.query
//     // Send Kiya {POST|PUT|PATCH} => req.body
//     const { id, name } = req.params
//     const { daughter, age } = req.query
//     res.send({ id, name, daughter, age })
// })





module.exports = router;