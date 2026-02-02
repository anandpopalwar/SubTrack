import UserModal from "../modals/user.modal.js";
import { ObjectId } from "mongodb";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModal.find();

    if (!allUsers) {
      let _err = new Error();
      _err.message = "Data not found";
      _err.statusCode = 404;

      throw _err;
    }

    console.log(allUsers);

    res.status(200).json({
      success: true,
      message: "Data get successfully",
      data: allUsers,
    });
  } catch (err) {
    console.log(err);

    return err;
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!ObjectId.isValid(id)) {
      let _err = new Error("Not valid id param");
      _err.statusCode = 409;
      throw _err;
    }

    const user = await UserModal.findById(id).select("-password");

    if (!user) {
      let _err = new Error("User not found");
      _err.statusCode = 404;
      throw _err;
    }

    console.log("user", user);

    res.status(200).json({
      success: true,
      message: "user data send successfully",
      data: user,
    });
  } catch (err) {
    console.log("", err);

    next(err);
  }
};
