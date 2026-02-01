// import mongoose from "mongoose";

import mongoose from "mongoose";

const connectToDatabase = async (DB_URI) => {
  // console.log("connectToDatabase", DB_URI);
  try {
    await mongoose.connect(DB_URI);

    console.log("Connection to db is successfull");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectToDatabase;
