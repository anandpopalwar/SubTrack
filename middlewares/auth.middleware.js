import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const authorizeMiddleware = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
      params: { id },
    } = req;
    console.log({ id });
    if (!authorization) {
      let _err = new Error("Token not found, please login");
      _err.statusCode = 404;
      throw _err;
    }

    const token = authorization.split(" ")[1];
    const rawUserData = jwt.verify(token, JWT_SECRET);

    console.log("rawUserData", rawUserData);

    if (rawUserData.userId !== id) {
      let _err = new Error("Unautherized user");
      _err.statusCode = 401;
      throw _err;
    }

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default authorizeMiddleware;
