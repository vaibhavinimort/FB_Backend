 const mongoose = require("mongoose");


 const userSchema = mongoose.Schema({
     first_name: {
         type: String,
         required: [true, "first name is required"],
         trim: true,
         text: true,
     },
     last_name: {
         type: String,
         required: [true, "first name is required"],
         trim: true,
         text: true,
     },
     first_name: {
         type: String,
         required: [true, "first name is required"],
         trim: true,
         text: true,
     },
     first_name: {
         type: String,
         required: [true, "first name is required"],
         trim: true,
         text: true,
     },
 })