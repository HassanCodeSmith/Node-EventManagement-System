import { Users } from "../models/user.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { BadRequestError, NotFoundError } from "../errors/index.errors.js";

/** __________ Login __________ */
export const login = async (req, res) => {
  const { Name, Password } = req?.body;

  const user = await Users.findOne({ Name });

  if (!user) {
    throw new NotFoundError("Manager not found with provided name.");
  }

  const isPasswordMatched = await user.comparePassword(Password);

  if (!isPasswordMatched) {
    throw new BadRequestError("Password is incorrect.");
  }

  const token = user.createJWT();
  const modifiedUser = await Users.findOne({ _id: user._id }).select(
    "-Password"
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "User logged in successfully.",
      token,
      data: modifiedUser,
    })
  );
};

/** __________ Get User By Id __________ */
export const getManagerById = async (req, res) => {
  const manager = await Users.findById(req?.userId).select("-Password");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "User details fetched successfully.",
      data: manager,
    })
  );
};

/** __________ Get All Users By Admin __________ */
export const getAllUsersByAdmin = async (req, res) => {
  const users = await Users.find({}).select("-Password");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Users fetched successfully.",
      data: users,
    })
  );
};
