import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send("Get all Subscriptions"));
subscriptionRouter.get("/:id", (req, res) => res.send("Get perticular id"));
subscriptionRouter.post("/", (req, res) => res.send("Create subscription"));
subscriptionRouter.put("/", (req, res) => res.send("Update subscription"));
subscriptionRouter.delete("/:id", (req, res) =>
  res.send("Delete subscription"),
);
subscriptionRouter.get("/user/:id", (req, res) =>
  res.send("get perticular user subscription"),
);
subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send("Cancel perticular subscription"),
);
subscriptionRouter.put("/upcoming-renewals", (req, res) =>
  res.send("get upcoming renewals subscription"),
);

export default subscriptionRouter;
