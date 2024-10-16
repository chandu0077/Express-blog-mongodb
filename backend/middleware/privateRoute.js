const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const refreshToken = req.header("refresh-token");

      if (!refreshToken) return res.status(401).send("Acess Denied");
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const newAccessToken = generateAccessToken(decoded._id);
        res.setHeader("auth-token", newAccessToken);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).send("Invalid refresh Token");
      }
    } else {
      res.status(401).send("Invalid Token!!!");
    }
  }
};

function generateAccessToken(userId) {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "50m",
  });
}
