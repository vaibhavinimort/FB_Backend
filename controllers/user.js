const { validateEmail } = require("../helpers/validation");
const { validateLength } = require("../helpers/validation");
const { validateUsername } = require("../helpers/validation");
const { generateToken } = require("../helpers/token");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../helpers/mailer");


exports.register = async(req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            username,
            bYear,
            bMonth,
            bDay,
            gender,
        } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "invalid email addres",
            });
        }

        const check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({
                message: "the email adress already exits,try with different email adress",
            });
        }

        if (!validateLength(first_name, 3, 30)) {
            return res.status(400).json({
                message: "first_name is bet 3 to 30 charactres",
            });
        }
        if (!validateLength(last_name, 3, 30)) {
            return res.status(400).json({
                message: "last_name is bet 3 to 30 charactres",
            });
        }
        if (!validateLength(password, 3, 30)) {
            return res.status(400).json({
                message: "password is bet 3 to 30 charactres",
            });
        }

        const cryptedPassword = await bcrypt.hash(password, 12);

        let tempUsername = first_name + last_name;
        let newUsername = await validateUsername(tempUsername);


        const user = await new User({
            first_name,
            last_name,
            email,
            password: cryptedPassword,
            username: newUsername,
            bYear,
            bMonth,
            bDay,
            gender,
        }).save();

        const emailVerificationToken = generateToken({ id: user._id.toString() },
            "7d"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
        sendVerificationEmail(user.email, user.first_name, url);
        const token = generateToken({ id: user._id.toString() }, "7d")
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            message: 'register success ! please activate your email to start',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.activateAccount = async(req, res) => {
    try {
        const { token } = req.params;
        const validUser = req.user.id;
        const user = jwt.verify(token, process.env.TOKEN_SECRETE);
        console.log(user);

        const check = await User.findById(user.id);
        console.log(check);
        if (validUser !== user.id) {
            return res.status(400).json({ message: "you dont have the authorization to complete this operation" });
        }

        if (check.verified == true) {
            return res.status(400).json({ message: "this email is already verifies" })
        } else {
            await User.findByIdAndUpdate(user.id, { verified: true });
            return res.status(200).json({ message: "Account has been activated successfully" })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        console.log({ email });
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "the email addres you entered is not connected to an account" });
        }
        const checkPasssword = await bcrypt.compare(password, user.password);
        if (!checkPasssword) {
            return res.status(400).json({ message: "invalid credential. Please try later." });

        }
        const token = generateToken({ id: user._id.toString() }, "7d")
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            message: 'register success ! please activate your email to start',
        });
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}

exports.sendVerification = async(req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (user.verified === true) {
            return res.status(400).json({ message: "this account is already activated" });
        }
        const emailVerificationToken = generateToken({ id: user._id.toString() },
            "30m"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
        sendVerificationEmail(user.email, user.first_name, url);
        return res.status(200).json({ message: "Email verification link has been send to your email" });

    } catch (error) {
        res.status(500).json({ message: "message.error" })
    }
}