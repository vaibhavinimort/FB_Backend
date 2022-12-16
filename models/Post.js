const mongoose = require("mongoose");

const { ObjectId } = new mongoose.Schema({
    type: {
        type: String,
        enum: ["profilepicture", "cover", null],
        default: null,
    },
    text: {
        type: String,
    },
    iamges: {
        type: Array,
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    background: {
        type: String,
    },
    comments: [{
        comment: {
            type: String,
        },
        image: {
            type: String;
        },
        commentBy: {
            type: ObjectId,
            ref: "User"
        },
        commentAt: {
            type: Date,
            dafault: new Date();
        },
    }, ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Post", postSchema);