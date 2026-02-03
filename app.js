import { DB_URI, NODE_ENV, PORT } from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import authRouter from "./routes/auth.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetmiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());
app.use(arcjetmiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello Server is Running " + NODE_ENV + PORT);
});

app.listen(PORT, async () => {
  console.log("Server Running on http://localhost:" + PORT);

  console.log("making connection to db at " + NODE_ENV + " mode");
  await connectToDatabase(DB_URI);
});
