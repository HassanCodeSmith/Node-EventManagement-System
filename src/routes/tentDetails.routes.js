import { Router } from "express";
import {
  trimObjects,
  filterMissingFields,
  managerAuth,
  adminAuth,
} from "../middlewares/index.middlewares.js";
import {
  bookTent,
  updateTent,
  countTents,
  countTentsByAdmin,
  deleteTent,
  getAllTents,
  getAllTentsByAdmin,
  getTentById,
  searchTent,
  updateTentByAdmin,
  searchTentByAdmin,
  deleteTentByAdmin,
  bookTentByAdmin,
} from "../controllers/tentDetails.controllers.js";

const tentDetailsRouter = Router();

//////////////////////////////////
/**       Manager Routes        */
//////////////////////////////////
// Book Tent
tentDetailsRouter
  .route("/book-tent")
  .post(
    trimObjects,
    filterMissingFields([
      "TentNo",
      "GuestName",
      "PhoneNo",
      "GuestType",
      "CheckInDate",
      "CheckOutDate",
      "Status",
    ]),
    managerAuth,
    bookTent
  );

// Count Tents
tentDetailsRouter.route("/count-tents").get(managerAuth, countTents);

// Get All Tents
tentDetailsRouter.route("/get-all-tents/:Status").get(managerAuth, getAllTents);

// Get Tent By Id
tentDetailsRouter.route("/get-tent/:TentId").get(getTentById);

// Update Tent
tentDetailsRouter
  .route("/update-tent/:TentId")
  .put(
    trimObjects,
    filterMissingFields([
      "TentNo",
      "GuestName",
      "PhoneNo",
      "GuestType",
      "CheckInDate",
      "CheckOutDate",
      "Status",
    ]),
    managerAuth,
    updateTent
  );

// Search Tents
tentDetailsRouter.route("/search-tents/:text").get(managerAuth, searchTent);

// Delete Tent
tentDetailsRouter.route("/delete-tent/:TentId").delete(managerAuth, deleteTent);

//////////////////////////////////
/**        Admin Routes         */
//////////////////////////////////
// Book Tent By Admin
tentDetailsRouter
  .route("/book-tent-by-admin")
  .post(
    trimObjects,
    filterMissingFields([
      "Name",
      "TentNo",
      "GuestName",
      "PhoneNo",
      "GuestType",
      "CheckInDate",
      "CheckOutDate",
      "Status",
    ]),
    adminAuth,
    bookTentByAdmin
  );

// Count Tents By Admin
tentDetailsRouter.route("/count-tents/:Name").get(adminAuth, countTentsByAdmin);

// Get All Tents By Admin
tentDetailsRouter
  .route("/get-all-tents-by-admin/:Name")
  .get(adminAuth, getAllTentsByAdmin);

// Update Tent By Admin
tentDetailsRouter
  .route("/update-tent-by-Admin/:TentId")
  .put(
    trimObjects,
    filterMissingFields([
      "TentNo",
      "GuestName",
      "PhoneNo",
      "GuestType",
      "CheckInDate",
      "CheckOutDate",
      "Status",
    ]),
    adminAuth,
    updateTentByAdmin
  );

// Search Tent By Admin
tentDetailsRouter
  .route("/search-tents/:text/:Name")
  .get(adminAuth, searchTentByAdmin);

// Delete Tent By Admin
tentDetailsRouter
  .route("/delete-tent-by-admin/:TentId")
  .delete(adminAuth, deleteTentByAdmin);

export { tentDetailsRouter };
