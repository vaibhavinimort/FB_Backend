const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const SMTPServer = require("smtp-server").SMTPServer;
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const useRoutes = require("./routes/user");
const { Console } = require("console");
app.use("/user", useRoutes);

//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// database
console.log(process.env.DATABASE_URL, "databse ")
mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    })
    .then(() => console.log("database connected succesfully"))
    .catch((err) => console.log("error connecting to mongodb", err));



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Running on hello ${PORT}`);
});