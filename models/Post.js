const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["profilepicture", "cover", null],
        default: null,
    },
    text: {
        type: String,
    },
    images: {
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
            type: String
        },
        commentBy: {
            type: ObjectId,
            ref: "User"
        },
        commentAt: {
            type: Date,
            require: true
        },
    }, ],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Post", postSchema);