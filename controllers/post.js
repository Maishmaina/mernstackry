const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const Post = require("../models/post");

//@desc     Get post by id
//@route    GET /route/post
//@access   Private
exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({ error: err });
      }
      req.post = post;
      next();
    });
};

//@desc     Get all posts
//@route    GET /route/
//@access   Public
exports.getPosts = async (req, res) => {
  try {
    const post = await Post.find()
      .select("_id title body")
      .populate("postedBy", "_id name");
    res.json(post);
  } catch (err) {
    console.error(err.message);
  }
};
//@desc     Post post
//@route    POST /route/post
//@access   Private
exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "image could not be uploaded" });
    }
    let post = new Post(fields);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(result);
    });
  });
};
//@desc     Get post by User
//@route    GET /route/post
//@access   Private

exports.postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(posts);
    });
};
//@desc     Get user is the owner of post
//@route    GET /route/post
//@access   Private
exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({ error: "Sorry! User not Authorized" });
  }
  next();
};
//@desc     Update post
//@route    PUT /route/post
//@access   Private
exports.updatePost = async (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now();
  let result = await post.save();
  res.json(result);
};

//@desc     Delete post
//@route    DELETE /route/post
//@access   Private

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status.json({ error: err });
    }
    res.json({ message: "Post Deleted Successfully" });
  });
};
