import { Router } from "express";
import { SignIn } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.get("/sign-in", SignIn);
authRouter.get("/sign-up", (req, res) => res.send("sign up route"));
authRouter.get("/sign-out", (req, res) => res.send("sign out route"));

export default authRouter;
