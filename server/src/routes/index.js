import express from "express";
import usersRouter from "./users.js";
import channelsRouter from "./channels.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.use("/users", usersRouter);
router.use("/channels", channelsRouter);

export default router;
