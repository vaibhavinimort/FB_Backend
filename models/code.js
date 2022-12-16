const mongoose = require("mongoose");


const { ObjectId } = mongoose.Schema;

const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "User",
        require: true,
    },
});

module.exports = mongoose.model("code", codeSchema);