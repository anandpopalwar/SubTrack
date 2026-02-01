import { Router } from "express";

const authRouter = Router();

authRouter.get("/sign-in", (req, res) => res.send("sign in route"));
authRouter.get("/sign-up", (req, res) => res.send("sign up route"));
authRouter.get("/sign-out", (req, res) => res.send("sign out route"));

export default authRouter;
