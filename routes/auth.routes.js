import { Router } from "express";
import { Login, Register } from "../controller/auth.controller.js";

const authRouter = Router();

// to register new user
authRouter.get("/register", Register);
// to login user
authRouter.get("/log-in", Login);
// to logout user
authRouter.get("/log-out", (req, res) => res.send("sign out route"));

export default authRouter;
