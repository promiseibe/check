require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});
const user = mongoose.model("User", userSchema);

app.get("/", (req, res ) => {
    res.render("home")
});

app.get("/login", (req, res ) => {
    res.render("login")
});

app.get("/register", (req, res ) => {
    res.render("register")
}); 

// post request on register
app.post("/register", (req, res) => {
    const newUser = new user({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then(data => {
        res.render("secrets")
    }).catch(error => {
        res.render(error.message)
    })
});

// post request on login
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

user.findOne({email: username}).then(data => {
    if(data.password === password) {
        res.render("secrets");
    }
}).catch(err => {
    console.log(err)
});
})

app.listen(3000, () => {
    console.log("port 3000")
})