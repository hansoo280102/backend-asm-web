const isAdmin = (req, res, next) => {
  if (req.role != "admin") {
    return res.status(403).json({
      success: false,
      message:
        "you are not allowed to do perform this action. Please ttry to login as an admin",
    });
  }
  next();
};

module.exports = isAdmin;
