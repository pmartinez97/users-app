const checkAuth = (req, res, next) => {
  if (!req.isAuth || req.userId != req.params.id) {
    return res.status(400).send("unauthenticated!");
  }

  next();
};

module.exports = checkAuth;
