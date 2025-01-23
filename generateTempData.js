import mongoose from "mongoose";
import { TentDetails } from "./src/models/tentDetails.model.js";
import { faker } from "@faker-js/faker";

async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/Event-Management-System",
      {
        // Replace with your MongoDB URI
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function generateData() {
  const userId = "677c1987571adc70a8396ec5";
  const guestTypes = ["VVIP"];
  const statuses = ["CheckedIn", "CheckedOut", "Reserved"];

  const tentData = Array.from({ length: 60 }).map(() => {
    const checkInDate = faker.date.past();
    const days = faker.number.int({ min: 1, max: 7 }); // Updated method
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + days);

    return {
      UserId: userId,
      TentNo: faker.number.int({ min: 1, max: 60 }), // Updated method
      TotalPersons: faker.number.int({ min: 1, max: 5 }), // Updated method
      NeedExtraBed: faker.datatype.boolean(),
      GuestName: Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => faker.name.fullName()
      ), // Updated method
      PhoneNo: faker.phone.number("##########"), // Updated method
      Place: faker.address.city(),
      GuestType:
        guestTypes[faker.number.int({ min: 0, max: guestTypes.length - 1 })], // Updated method
      Days: days,
      CheckInDate: checkInDate,
      CheckOutDate: checkOutDate,
      IsTentClean: faker.datatype.boolean(),
      Status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })], // Updated method
    };
  });

  try {
    await TentDetails.insertMany(tentData);
    console.log("Successfully inserted 60 records.");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

(async () => {
  await connectToDatabase();
  await generateData();
  mongoose.connection.close();
})();
