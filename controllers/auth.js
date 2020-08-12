const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();
const User = require("../models/user");
//@desc     Post user
//@route    POST /route/signup
//@access   Public
exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(403).json({ error: "User Exists!" });
  const user = await new User(req.body);
  await user.save();
  res.json({ message: "Signup Success, Please Login" });
};

//@desc     Post user
//@route    POST /route/login
//@access   Public
exports.signin = async (req, res) => {
  //find user with email in db
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "User Not Found, Please Register" });
  }
  //method to check if password match from the model
  if (!user.authenticate(password)) {
    return res
      .status(401)
      .json({ error: "Email and Password does Not Match!" });
  }
  //create token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  //persist token jwtToken in cookies with expiry date
  res.cookie("t", token, { expire: new Date() + 18000 });
  //return response with user details
  return res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email },
  });
};
//@desc     Get user
//@route    GET /route/signout
//@access   Public
exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};
//@desc     Handle authentication.
//@route    Mindleware for protected routes
//@access   Public
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
