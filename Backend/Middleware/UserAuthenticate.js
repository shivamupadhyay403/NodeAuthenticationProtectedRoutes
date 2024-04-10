const jwt = require("jsonwebtoken");

const VerifyUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = VerifyUser;
