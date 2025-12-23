const jwt = require("jsonwebtoken");

const VerifyUser = (req, res, next) => {
  const authHeader = req.headers["x-access-token"];

  if (authHeader == null ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
 
  const token = authHeader

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { VerifyUser };