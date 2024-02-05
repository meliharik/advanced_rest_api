const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, process.env.SECRET_TOKEN);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;
