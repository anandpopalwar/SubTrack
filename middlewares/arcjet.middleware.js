import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../config/arcjet.js";

const arcjetmiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
    // console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "No bots allowed" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
    } else if (decision.ip.isHosting()) {
      // Requests from hosting IPs are likely from bots, so they can usually be
      // blocked. However, consider your use case - if this is an API endpoint
      // then hosting IPs might be legitimate.
      // https://docs.arcjet.com/blueprints/vpn-proxy-detection

      res.status(403).json({ error: "Forbidden" });
    } else if (decision.results.some(isSpoofedBot)) {
      // Paid Arcjet accounts include additional verification checks using IP data.
      // Verification isn't always possible, so we recommend checking the decision
      // separately.
      // https://docs.arcjet.com/bot-protection/reference#bot-verification

      res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    console.log(err);

    next(err);
  }
};

export default arcjetmiddleware;
