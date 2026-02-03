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

app.set("trust proxy", 1);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(cookieParser());
app.use("/api", arcjetmiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    env: NODE_ENV,
    uptime: process.uptime(),
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello Server is Running " + NODE_ENV + PORT);
});

const startServer = async () => {
  try {
    await connectToDatabase(DB_URI);
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
