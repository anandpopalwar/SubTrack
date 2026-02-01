import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      unique: true,
      minLength: 3,
      maxLength: 15,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not Valid"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      trim: true,
      match: [
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password is not Valid",
      ],
      minLength: 8,
      maxLength: 50,
      select: false, // password won’t come in queries by default
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

const User = mongoose.model("user", userSchema);

export default User;
