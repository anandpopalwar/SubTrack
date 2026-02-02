import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 3,
      required: [true, "Subscription name is required"],
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Subscription Price should be more then 0"],
    },

    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Daily",
    },
    category: {
      type: String,
      enum: [
        "entertainment", // Netflix, Spotify, Hulu
        "utility", // iCloud, Google One, Dropbox, LastPass
        "productivity", // Microsoft 365, Slack, Zoom
        "education", // Masterclass, Duolingo, Coursera
        "health-fitness", // Peloton, Calm, Strava
        "news-media", // NYTimes, WSJ, Bloomberg
        "gaming", // Xbox Game Pass, PlayStation Plus
        "e-commerce", // Amazon Prime, Boxycharm
        "finance", // Revolut Premium, YNAB
        "software", // Adobe Creative Cloud, Figma
        "food-drink", // HelloFresh, Coffee Subscriptions
        "dating", // Tinder Gold, Bumble Boost,
        "other",
      ],
    },
    paymentMethod: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value >= new Date(),
        message: "Start date must be before today",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value < this.startDate;
        },
        message: "Renewal date must be after today",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      Daily: 1,
      Weekly: 7,
      Monthly: 30,
      Yearly: 365,
    };

    this.renewalDate = new Date();
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency],
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }

  next();
});

const SubscriptionModal = mongoose.model("subscription", subscriptionSchema);

export default SubscriptionModal;
