import mongoose, { Schema } from "mongoose";
import { BadRequestError } from "../errors/index.errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    Name: {
      type: String,
      enum: [
        "Admin",
        "Gadhpur Dham",
        "Vadtal Dham",
        "Dholera Dham Gents",
        "Dholera Dham Ladies",
        "Temple",
      ],
      index: true,
      unique: true,
    },

    Password: {
      type: String,
      required: true,
    },

    Role: {
      type: String,
      enum: ["Admin", "Manager"],
      default: "Manager",
    },

    TentRange: {
      type: Number,
    },
  },
  { timestamps: true, collection: "Users" }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("Password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    console.error("There is an issue while hashing password.", error);
    throw new BadRequestError("There is an issue while hashing password.");
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.Password);
  } catch (error) {
    console.error("There is an error while comparing password.", error);
    throw new BadRequestError("There is an error while comparing password.");
  }
};

userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

export const Users = mongoose.model("User", userSchema);
