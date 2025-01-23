import { BadRequestError } from "../errors/index.errors.js";

export const managerAuth = async (req, res, next) => {
  if (req?.userRole !== "Manager") {
    console.error("Invalid role.");
    throw new BadRequestError("Invalid role");
  }

  next();
};
