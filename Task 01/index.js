const notifier = require("node-notifier");
const sha256 = require("sha256");
const kill = require("kill-port");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
kill(3000, "tcp");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/registration", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.post("/sign_up", (req, res) => {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var gender = req.body.gender;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = sha256(req.body.password);

  var data = {
    fname: fname,
    lname: lname,
    gender: gender,
    email: email,
    phone: phone,
    password: password,
  };
  db.collection("usersinfo").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });
  notifier.notify({
    title: "Registration done",
    message: "Thanks for registering with us..",
    icon: "tick.webp",
    sound: true,
    wait: true,
  });
  return res.redirect("home.html");
});

app
  .get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("register.html");
  })
  .listen(3000);
console.log("Listening on PORT 3000");
