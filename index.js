/** __________ All Imports __________ */
import "express-async-errors";
import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import https from "https";
import http from "http";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import fs from "fs";

import { ConnectDb } from "./src/config/db.config.js";
import { notFound } from "./src/middlewares/notFound.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import { router } from "./src/routes/index.routes.js";
import { configureSocket } from "./src/sockets/socket.js";
import { createAdminAndManagers } from "./src/utils/createAdminAndManagers.util.js";

/** __________ Dot Env Configuration __________ */
dotenv.config();

/** __________ Express Instance __________ */
const app = express();

/** __________ SET PORT __________ */
app.set("port", process.env.PORT || 3001);

/** __________ Middlewares __________ */
app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/** __________ Testing Route __________ */
app.route("/").get((req, res) => {
  return res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; font-size:9rem; margin-top:10rem;'>Server is running.</h1>"
  );
});

/** Routes */
app.use("/api/v1", router);

/** __________ Error Handling Middlewares __________ */
app.use(notFound);
app.use(errorHandler);

/** __________ Server Setup with Clustering __________ */
let server;
if (process.env.NODE_ENV === "PRODUCTION") {
  try {
    const privateKey = fs.readFileSync("./privkey.pem", "utf8");
    const certificate = fs.readFileSync("./fullchain.pem", "utf8");

    const options = {
      key: privateKey,
      cert: certificate,
    };

    server = https.createServer(options, app);
  } catch (err) {
    console.error("Error reading files:", err);
  }
} else {
  server = http.createServer(app);
}
const io = configureSocket(server);
/** __________ Server Listing & DB Connection __________ */
(async () => {
  try {
    await ConnectDb();
    await createAdminAndManagers();
    server.listen(app.get("port"), () => {
      console.info("==> 🌎 Go to http://localhost:%s", app.get("port"));
    });
  } catch (error) {
    console.error("An error occurred while running server", error);
  }
})();
