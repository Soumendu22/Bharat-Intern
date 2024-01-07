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

mongoose.connect("mongodb://localhost:27017/expense", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.post("/track", (req, res) => {
  var type = req.body.type;
  var name = req.body.name;
  var amount = req.body.amount;

  var data = {
    type: type,
    name: name,
    amount: amount,
  };
  db.collection("tracker").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });
  return res.redirect("home.html");
});

app
  .get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    return res.redirect("home.html");
  })
  .listen(3000);
console.log("Listening on PORT 3000");
