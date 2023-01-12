const { validateEmail } = require("../helpers/validation");
const { validateLength } = require("../helpers/validation");
const { validateUsername } = require("../helpers/validation");
const { generateToken } = require("../helpers/token");
const Code = require("../models/Code");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const generateCode = require("../helpers/generateCode");
const { errorMonitor } = require("nodemailer/lib/xoauth2");


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
                message: "invalid email address",
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
exports.activateEmail = async(req, res) => {
    try {
        const { token } = req.params;
        const user = jwt.verify(token, process.env.TOKEN_SECRETE);
        console.log(user);

        const check = await User.findById(user.id);
        console.log(check);
        // if (validUser !== user.id) {
        //     return res.status(400).json({ message: "you dont have the authorization to complete this operation" });
        // }

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
        console.log(id);
        const user = await User.findById(id);
        console.log(user);
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
        res.status(500).json({ message: error.message })
    }
}

exports.findUser = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");
        if (!user) {
            return res.status(400).json({ message: "this account is not exist" });
        }
        return res.status(200).json({ email: user.email, picture: user.picture, });
    } catch (error) {
        res.status(500).json({ message: "message.error" })
    }
}

exports.sendResetPasswordCode = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");
        console.log(user);
        const userId = await Code.findOneAndRemove({ user: user._id });
        console.log(userId);
        const code = generateCode(5);
        const saveCode = await new Code({ code, user: user._id }).save();
        sendResetCode(user.email, user.first_name, code);
        return res.status(200).json({ message: 'Email reset code has been sent to your email.' });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


exports.validateResetCode = async(req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        const Dbcode = await Code.findOne({ user: user._id });
        if (Dbcode.code !== code) {
            return res.status(400).json({ message: "verification code is wrong.." });
        }
        return res.status(200).json({ message: 'ok' });
    } catch (error) {
        res.status(500).json({ message: "message.error" })
    }
}

exports.changePassword = async(req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const cryptedPassword = await bcrypt.hash(password, 12);
        await User.findOneAndUpdate({ email }, { password: cryptedPassword, });
        return res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getProfile = async(req, res) => {
    try {
        const { username } = req.params;
        const profile = await User.find({ username }).select("-password");
        if (!profile) {
            return res.json({ ok: false })
        }
        const posts = await Post.find({ user: profile_id }).populate("user");
        res.json({...profile.toObject(), posts });
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
};

exports.updateProfilePicture = async(req, res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            picture: url,
        });
        res.json(url);
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

exports.updateCover = async(req, res) => {
    try {
        const { url } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            cover: url,
        });
        res.json(url);
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

exports.updateDetails = async(req, res) => {
    try {
        const { infos } = req.body;
        const updated = await User.findByIdAndUpdate(req.user.id, {
            details: infos,
        }, {
            new: true,
        });
        res.json(updated.details);
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

exports.addFriend = async(req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

        } else {
            return res.status(400).json({ message: "you can't send a request to yourself" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}