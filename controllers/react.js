const React = require('../models/React')
const mongoose = require("mongoose");
exports.reactPost = async(res, req) => {
    try {
        const { postId, react } = req.body;
        const check = await React.findOne({
            postRef: postId,
            reactBy: mongoose.Types.objectId(req.user.id),
        });
        if (check == null) {
            const newReact = new React({
                react: react,
                postRef: postId,
                reactBy: req.user.id;
            })
            await newReact.save();
        } else {
            if (check.react == react) {
                await React.findByIdAndRemove(check._id);
            } else {
                await React.findByIdAndUpdate(check._id, {
                    react: react,
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getReacts = async(res, req) => {
    try {
        const reactsArray = await React.find({ postRef: req.params.id });

        const newReacts = reactsArray.reduce((group, react) => {
            let key = react["react"];
            group[key] = group[key] || [];
            group[key].push(react);
            return group;
        }, {});

        const reacts = [{
                react: 'like',
                count: newReacts.like ? newReacts.like.length : 0,
            },
            {
                react: 'love',
                count: newReacts.like ? newReacts.like.length : 0,
            },
            {
                react: 'sad',
                count: newReacts.like ? newReacts.like.length : 0,
            },
            {
                react: 'wow',
                count: newReacts.like ? newReacts.like.length : 0,
            },
            {
                react: 'angry',
                count: newReacts.like ? newReacts.like.length : 0,
            },
        ]

        const check = awaitReact.findOne({
            postRef: req.params.id,
            reactBy: req.user.id
        });
        res.json({
            reacts,
            check: check ? .react,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
};