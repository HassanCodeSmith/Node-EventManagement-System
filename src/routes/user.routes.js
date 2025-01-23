import { Router } from "express";
import {
  login,
  getManagerById,
  getAllUsersByAdmin,
} from "../controllers/user.controllers.js";
import {
  trimObjects,
  filterMissingFields,
  loginAuth,
  adminAuth,
} from "../middlewares/index.middlewares.js";

const userRouter = Router();

// Login
userRouter
  .route("/login")
  .post(trimObjects, filterMissingFields(["Name", "Password"]), login);

// Get By Id
userRouter.route("/get").get(loginAuth, getManagerById);

// Get All Users By Admin
userRouter.route("/get-all").get(loginAuth, adminAuth, getAllUsersByAdmin);

export { userRouter };
