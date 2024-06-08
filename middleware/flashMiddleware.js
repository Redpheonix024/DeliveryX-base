module.exports = (req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
    // Add more types of messages if needed
  };
  next();
};
