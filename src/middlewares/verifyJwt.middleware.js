import jwt from "jsonwebtoken";
const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      // console.log(req.cookies);

    if (!token) {
      throw new Error("authorization failed");
    } else {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      if (decodedData) {
        req.user = decodedData;
        next();
      } else {
        throw new Error("invalid jwt token");
      }
    }
  } catch (error) {
    next(error);
  }
};

export default verifyJwt;
