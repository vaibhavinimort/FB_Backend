const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("welcome from ashish");
});
app.get("/books", (req, res) => {
    res.send("welcome from ashis home");
});
app.listen(8000, () => {
    console.log(`Running on hello 8000`);
});