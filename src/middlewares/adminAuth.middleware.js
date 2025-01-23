import { BadRequestError } from "../errors/index.errors.js";

export const adminAuth = async (req, res, next) => {
  if (req.userRole !== "Admin") {
    console.error("Invalid role.");
    throw new BadRequestError("Invalid role");
  }

  next();
};
