import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModal from "../modals/user.modal.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE_IN } from "../config/env.js";

// Start Session
// Start Transaction
// Commit Transaction or Abort Transaction
// End Session

export const Register = async (req, res, next) => {
  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    const { name, email, password } = req.body;

    console.log(name, email, password);

    // checking if user exist or not
    const existing = await UserModal.exists({ email });
    if (existing) {
      // if exist throw error and let error handler do it
      let error = new Error("User already exist");
      error.statusCode = 409;
      throw error;
    }

    // we hash our password and
    // then store it into db
    const Salt = await bcrypt.genSalt(10);
    const HashedPassword = await bcrypt.hash(password, Salt);

    console.log(HashedPassword, "HashedPassword");

    //create a user with session as a parameter
    const users = await UserModal.create(
      [
        {
          name,
          email,
          password: HashedPassword,
        },
      ],
      {
        session,
      },
    );

    console.log(users[0]);

    // commit a transaction
    await session.commitTransaction();

    // sends reponse back
    res.status(201).json({
      success: true,
      message: name + " User Created Successfully",
    });
  } catch (err) {
    // abort transaction
    await session.abortTransaction();
    console.log(err);
    // pass error to handler
    next(err);
  } finally {
    // end session
    await session.endSession();
  }
};

export const Login = async (req, res, next) => {
  const { first, password } = req.body;
  console.log(first, password);

  try {
    if (!first || !password) {
      let error = new Error("Feilds are empty please fill it");
      error.statusCode = 400;
      throw error;
    }

    let dbUser = undefined;

    if (/^\S+@\S+\.\S+$/.test(first)) {
      dbUser = await UserModal.findOne({
        email: first,
      }).select("+password");
    } else {
      dbUser = await UserModal.findOne({
        name: first,
      }).select("+password");
    }

    if (!dbUser) {
      let error = new Error("User is does not exist");
      error.statusCode = 400;
      throw error;
    }
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    console.log({ isPasswordMatched });

    if (!isPasswordMatched) {
      let error = new Error("Password is invalid");
      error.statusCode = 400;
      throw error;
    }

    console.log(dbUser);

    const token = jwt.sign(
      {
        userId: dbUser._id,
        name: dbUser.name,
        admin: true,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE_IN,
      },
    );

    console.log("Token", token);

    res.status(200).json({
      success: true,
      message: "Login successfull",
      data: {
        token,
        user: {
          name: dbUser.name,
          email: dbUser.email,
          id: dbUser._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
