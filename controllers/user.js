const _ = require("lodash");
const User = require("../models/user");

//@desc   Get user byId
//@route  GET /route/:id
//@access Private
exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "Sorry! User not Found" });
    }
    req.profile = user;
  } catch (err) {
    res.status(500).json({ error: "Sorry! Server Error" });
  }

  next();
};

//@desc   Authorize user by id
//@route  GET /route/:id
//@access Private
exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res
      .status(403)
      .json({ error: "User is Not Authorized to perform this Action" });
  }
};

//@desc   Get all user
//@route  GET /user/all
//@access Public
exports.allUsers = async (req, res) => {
  const users = await User.find().select("name email updated created");
  if (!users) {
    return res.status(400).json({ error: "Error while getting Users" });
  }
  res.json(users);
};
//@desc   Get  user
//@route  GET /user/:id
//@access Private
exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
//@desc   Update User
//@route  PUT /user/:id
//@access Private
exports.updateUser = async (req, res) => {
  let user = req.profile;
  use = _.extend(user, req.body);
  user.updated = Date.now();
  try {
    let result = await user.save();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: "You are NOT authorized to perform this action" });
  }
};
//@desc   Delete User
//@route  DELETE /user/:id
//@access Private
exports.deleteUser = async (req, res) => {
  let user = req.profile;
  await user.remove();
  res.json({ success: true });
};
