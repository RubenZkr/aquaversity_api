const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token directly from the cookies
  if (!token) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  next();
};

module.exports = verifyToken;
