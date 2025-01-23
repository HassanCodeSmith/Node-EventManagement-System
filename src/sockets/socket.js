import { Server } from "socket.io";
import cron from "node-cron";
import { TentDetails } from "../models/tentDetails.model.js";

export const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let currentTents = {};

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    socket.emit("welcome", "Welcome to the server!");
    // socket.on("initial-tents", () => {
    //   console.log("initial hit");
    //   io.emit("initial-tents", currentTents);
    // });
    // console.log("global hit");
    io.on("fetch-data-inprogress", () => {
      io.emit("inprogress-tents", currentTents);
    });
    io.emit("inprogress-tents", currentTents);

    socket.on("request-tent", ({ tentNo, name }) => {
      // if (!currentTents[tentNo]) {
      if (currentTents[name]) {
        currentTents[name] = { ...currentTents[name], [tentNo]: "Pending" };
      } else {
        currentTents[name] = { [tentNo]: "Pending" };
      }
      io.emit("inprogress-tents", currentTents);
      console.log(currentTents);
      // }
      io.emit("inprogress-tents", currentTents);
      console.log("emiting tents");
    });

    socket.on("release-tent", ({ tentNo, name }) => {
      if (currentTents[name]) {
        delete currentTents[name][tentNo];
        io.emit("inprogress-tents", currentTents);
      }
      // if (currentTents[tentNo] === socket.id) {
      //   delete currentTents[tentNo];
      //   io.emit("inprogress-tents", currentTents);
      // }
    });

    socket.on("disconnect", () => {
      console.log("Current Tents.");
      // Object.keys(currentTents).forEach((tentNo) => {
      //   if (currentTents[tentNo] === socket.id) {
      //     delete currentTents[tentNo];
      //   }
      // });
      io.emit("inprogress-tents", currentTents);
      // Object.keys(currentTents).forEach((tentNo) => {
      //   if (currentTents[tentNo] === socket.id) {
      //     delete currentTents[tentNo];
      //   }
      // });
      // currentTents = {};
      io.emit("inprogress-tents", currentTents);
      console.log("A user disconnected.", socket.id);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("attempts", attemptNumber);
    });
  });
  // io.on("connection", (socket) => {
  //   console.log(`New user connected: ${socket.id}`);

  //   socket.emit("welcome", "Welcome to the server!");
  //   io.emit("update-tents", currentTents);

  //   socket.on("request-tent", ({ tentNo, clientSocketId }) => {
  //     if (!currentTents[tentNo]) {
  //       // currentTents[tentNo] = clientSocketId;
  //       currentTents[tentNo] = "Pending";
  //     }
  //     io.emit("update-tents", currentTents);
  //     console.log("emiting tents");
  //   });

  //   socket.on("release-tent", (tentNo) => {
  //     if (currentTents[tentNo] === socket.id) {
  //       delete currentTents[tentNo];
  //       io.emit("update-tents", currentTents);
  //     }
  //   });

  //   socket.on("disconnect", () => {
  //     Object.keys(currentTents).forEach((tentNo) => {
  //       if (currentTents[tentNo] === socket.id) {
  //         delete currentTents[tentNo];
  //       }
  //     });
  //     io.emit("update-tents", currentTents);
  //     console.log("A user disconnected.", socket.id);
  //   });

  //   socket.on("reconnect", (attemptNumber) => {
  //     console.log("attempts", attemptNumber);
  //   });
  // });

  cron.schedule("0 8 * * *", async () => {
    console.log("Running daily checkout notification job...");

    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const guests = await TentDetails.find({
        CheckOutDate: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("UserId")
        .select("-Password");
      if (guests.length > 0) {
        // guests.forEach((guest) => {
        //   const { GuestName, PhoneNo } = guest;

        //   if (PhoneNo && GuestName.length > 0) {
        //     const message = `Guests ${GuestName.join(
        //       ", "
        //     )}, will checkout today. Please inform your guests.`;

        io.emit("checkout-notification", guests);
        console.log("Notification Sended");

        // console.log(`Notification sent to Manager`, message, PhoneNo);
        // }
        // });
      } else {
        console.log("No guests found for today's checkout.");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });

  return io;
};
