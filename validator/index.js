//post field validation
exports.createPostValidator = (req, res, next) => {
  req.check("title", "Check your Title").notEmpty();
  req
    .check("title", "Check your Title length, should be 4-150 characters")
    .isLength({ min: 4, max: 150 });
  req.check("body", "Check your Body").notEmpty();
  req
    .check("body", "Check your Body length, should be 4-150 characters")
    .isLength({ min: 4, max: 2000 });
  //check for errors
  const errors = req.validationErrors();
  //show as they occur
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //process to next process
  next();
};
//user field validation
exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req
    .check("email", "Check Email Format")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @ symbol")
    .isLength({ min: 4, max: 200 });

  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least a number");

  //check for errors
  const errors = req.validationErrors();
  //show as they occur
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //process to next process
  next();
};
