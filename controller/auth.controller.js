import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../modals/user.modal.js";

export const SignIn = async (req, res, next) => {
  console.log(req);
  //   console.log(res);
  //   console.log(next);

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    const { name, email, password } = req.body;

    console.log(name, email, password);

    // checking if user exist or not
    const existing = await User.exists({ email });
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
    const users = await User.create(
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

// Start Session
// Start Transaction
// Commit Transaction or Abort Transaction
// End Session
