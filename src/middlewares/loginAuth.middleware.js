import { Users } from "../models/user.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import jwt from "jsonwebtoken";
import { ApiResponce } from "../utils/apiResponce.util.js";

export const loginAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.error("Token must be provided.");
    // throw new NotFoundError("Token must be provided.");
    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "Token must be provided.",
        invalid: true,
      })
    );
  }

  let payload;
  try {
    payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (error) {
    console.error("Invalid token provided.", error);
    // throw new BadRequestError("Invalid token provided.");
    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "Invalid token provided.",
        invalid: true,
      })
    );
  }

  const user = await Users.findOne({ _id: payload.id });

  if (!user) {
    console.error("User not found by provided token");
    // throw new BadRequestError("User not found by provided token");
    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "User not found by provided token",
        invalid: true,
      })
    );
  }

  req.userId = user._id;
  req.userRole = user.Role;

  next();
};
