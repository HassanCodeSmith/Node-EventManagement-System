import { Router } from "express";
import { userRouter } from "./user.routes.js";
import { tentDetailsRouter } from "./tentDetails.routes.js";
import { loginAuth } from "../middlewares/index.middlewares.js";

const router = Router();

// Manager Routes
router.use("/user", userRouter);

// Tent Routes
router.use("/tent", loginAuth, tentDetailsRouter);

export { router };
