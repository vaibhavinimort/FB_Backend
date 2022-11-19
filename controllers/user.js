const User = require("../models/User");
exports.register = async(req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        bYear,
        bMonth,
        bDay,
        gender,
    } = req.body;;
    const user = await new User(req.body).save();
    res.json(user);
};