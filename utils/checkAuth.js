const checkAuth = (req, res, next) => {
  if (!req.isAuth) {
    return res.status(400).send("unauthenticated!");
  }

  next();
};

module.exports = checkAuth;
