const express = require("express");
const expressValidator = require("express-validator");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
const connectDB = require("./config/db");
//Bring in routes
const postRouters = require("./routes/post");
const authRouters = require("./routes/auth");
const userRouters = require("./routes/user");
//connect to db
connectDB();
//midleware
dotenv.config();
const app = express();
app.use(morgan("dev"));
//express req.body middleware
app.use(express.json({ extended: false }));
app.use(cookieParser());
//validate input
app.use(expressValidator());
//cross-site script
app.use(cors());
//api doc route
app.get("/", (req, res) => {
  fs.readFile("doc/apiDock.json", (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});
//routes
app.use("/", postRouters);
app.use("/", authRouters);
app.use("/", userRouters);
//check unauthorized middleware
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Sorry!, Unauthorized" });
  }
});
//listen server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Healthy on port ${PORT}!`);
});
