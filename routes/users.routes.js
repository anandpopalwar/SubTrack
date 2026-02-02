import { Router } from "express";
import { getAllUsers, getUserDetails } from "../controller/user.controller.js";
import authorizeMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", authorizeMiddleware, getUserDetails);
userRouter.post("/", (req, res) => res.send({ title: "Create user" }));
userRouter.put("/:id", (req, res) => res.send("Update user"));
userRouter.delete("/:id", (req, res) => res.send("Delete user"));

export default userRouter;
