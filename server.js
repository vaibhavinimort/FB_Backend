const express = require("express");
const app = express();

app.get("/", (req, res) => {
    console.log("Testing")
    res.send("welcome from ashish");
});
app.get("/books", (req, res) => {
    console.log("Testing 1")
    res.send("welcome from ashis home");
});
app.listen(8000, () => {
    console.log("Testing 2")
    console.log(`Running on hello 8000`);
});