import bcrypt from "bcrypt";
import { Users } from "../models/user.model.js";

export const createAdminAndManagers = async () => {
  try {
    const requiredUsers = [
      {
        Name: "Admin",
        Password: "123",
        Role: "Admin",
      },
      {
        Name: "Gadhpur Dham",
        Password: "123",
        Role: "Manager",
        TentRange: 1000,
      },
      {
        Name: "Vadtal Dham",
        Password: "123",
        Role: "Manager",
        TentRange: 1000,
      },
      {
        Name: "Dholera Dham Gents",
        Password: "123",
        Role: "Manager",
        TentRange: 500,
      },
      {
        Name: "Dholera Dham Ladies",
        Password: "123",
        Role: "Manager",
        TentRange: 500,
      },
      {
        Name: "Temple",
        Password: "123",
        Role: "Manager",
        TentRange: 60,
      },
    ];

    const existingUsers = await Users.find({
      Name: { $in: requiredUsers.map((user) => user.Name) },
    });
    const existingNames = existingUsers.map((user) => user.Name);

    const usersToCreate = requiredUsers.filter(
      (user) => !existingNames.includes(user.Name)
    );

    if (usersToCreate.length === 0) {
      console.log("All required users already exist.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(
      usersToCreate.map(async (user) => ({
        ...user,
        Password: await bcrypt.hash(user.Password, salt),
      }))
    );

    await Users.insertMany(hashedUsers);

    console.log(`Created ${usersToCreate.length} missing users successfully.`);
  } catch (error) {
    console.error("There was an issue creating users:", error);
  }
};
