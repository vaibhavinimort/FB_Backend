 const mongoose = require("mongoose");

 const { ObjectId } = mongoose.Schema.Types;

 const userSchema = mongoose.Schema({
     first_name: {
         type: String,
         required: [true, "first name is required"],
         trim: true,
         text: true,
     },
     last_name: {
         type: String,
         required: [true, "last name is required"],
         trim: true,
         text: true,
     },
     username: {
         type: String,
         required: [true, "uesrname name is required"],
         trim: true,
         text: true,
         unique: true,
     },
     email: {
         type: String,
         required: [true, "email is required"],
         trim: true,
     },
     password: {
         type: String,
         required: [true, "password is required"],
     },
     picture: {
         type: String,
         default: "https://thumbs.dreamstime.com/z/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
     },
     email: {
         type: String,
         required: [true, "email is required"],
         trim: true,
     },
     cover: {
         type: String,
         trim: true,
     },
     gender: {
         type: String,
         required: [true, "gender is required"],
         trim: true,
     },
     bYear: {
         type: Number,
         required: true,
         trim: true,
     },
     bMonth: {
         type: Number,
         required: true,
         trim: true,
     },
     bDay: {
         type: Number,
         required: true,
         trim: true,
     },
     verified: {
         type: Boolean,
         default: false,
     },
     friends: {
         type: Array,
         default: [],
     },
     following: {
         type: Array,
         default: [],
     },
     followers: {
         type: Array,
         default: [],
     },
     request: {
         type: Array,
         default: []
     },
     search: [{
         user: {
             type: ObjectId,
             ref: 'User'
         },
     }, ],
     details: {
         bio: {
             type: String,
         },
         otherName: {
             type: String,
         },
         job: {
             type: String,
         },
         workplace: {
             type: String,
         },
         highSchool: {
             type: String,
         },
         college: {
             type: String,
         },
         currentcity: {
             type: String,
         },
         hometown: {
             type: String,
         },
         relationship: {
             type: String,
             enum: ['Single', 'In a realtionshop', 'Married', 'divorced'],

         },
         instagram: {
             type: String,
         },
     },
     savedPosts: [{
         post: {
             type: ObjectId,
             ref: "Post",
         },
         SavedAt: {
             type: Date,
             default: new Date(),
         },
     }, ],
 }, {
     timestamps: true,
 });

 module.exports = mongoose.model("User", userSchema);