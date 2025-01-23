import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import { TentDetails } from "../models/tentDetails.model.js";
import { Users } from "../models/user.model.js";
import { ApiResponce } from "../utils/index.utils.js";

//////////////////////////////////
/**     Manager Controllers     */
//////////////////////////////////

/** __________ Add Tent By Manager __________ */
export const bookTent = async (req, res) => {
  console.log(req.body);
  const newTent = await TentDetails.create({
    ...req.body,
    UserId: req?.userId,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Tent Booked Successfully",
      data: newTent,
    })
  );
};

/** __________ Count Tents By Manager __________ */
export const countTents = async (req, res) => {
  const user = await Users.findOne({ _id: req?.userId }).select("TentRange");
  const totalTents = user.TentRange;

  const checkInTents = await TentDetails.find({
    UserId: req?.userId,
    Status: "CheckedIn",
  }).countDocuments();

  const reservedTents = await TentDetails.find({
    UserId: req?.userId,
    Status: "Reserved",
  }).countDocuments();

  const availableTents = totalTents - (checkInTents + reservedTents);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Counted Successfully",
      data: { totalTents, checkInTents, reservedTents, availableTents },
    })
  );
};

/** __________ Get All Tents By Manager __________ */
export const getAllTents = async (req, res) => {
  const { Status } = req?.params;

  if (!Status) {
    throw new BadRequestError("Please provide Status in params.");
  }

  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const skip = (page - 1) * limit;

  let tents;
  let totalTents;
  if (Status !== "All") {
    tents = await TentDetails.find({
      UserId: req?.userId,
      Status,
    })
      .sort({ TentNo: 1 })
      .skip(skip)
      .limit(limit);
    totalTents = await TentDetails.countDocuments({
      UserId: req?.userId,
      Status,
    });
  } else {
    tents = await TentDetails.find({
      UserId: req?.userId,
    })
      .sort({ TentNo: 1 })
      .skip(skip)
      .limit(limit);
    totalTents = await TentDetails.countDocuments({
      UserId: req?.userId,
    });
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Retrieved Successfully",
      data: {
        totalTents,
        page,
        limit,
        totalPages: Math.ceil(totalTents / limit),
        tents,
      },
    })
  );
};

/** __________ Update Tent Status By Manager __________ */
export const updateTent = async (req, res) => {
  const { TentId } = req?.params;
  console.log(TentId);
  if (!TentId) {
    throw new NotFoundError("Please provide TentId in params.");
  }

  const updatedTent = await TentDetails.findOneAndUpdate(
    { _id: TentId, UserId: req?.userId },
    { $set: req.body },
    { new: true }
  );

  if (!updatedTent) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: "Tent not found",
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tent status updated successfully",
      data: updatedTent,
    })
  );
};

/** __________ Search Tent By Manager __________ */
export const searchTent = async (req, res) => {
  const { text } = req.params;

  if (!text) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Search text (TentNo or GuestName) is required in params",
      })
    );
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    UserId: req.userId,
    $or: [
      { TentNo: parseInt(text) || 0 },
      {
        GuestName: {
          $elemMatch: { $regex: text, $options: "i" },
        },
      },
    ],
  };

  const tents = await TentDetails.find(query)
    .sort({ TentNo: 1 })
    .skip(skip)
    .limit(limit);

  const totalTents = await TentDetails.countDocuments(query);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Retrieved Successfully",
      data: {
        totalTents,
        page,
        limit,
        totalPages: Math.ceil(totalTents / limit),
        tents,
      },
    })
  );
};

/** __________ Get Tent By Id By __________ */
export const getTentById = async (req, res) => {
  const { TentId } = req?.params;

  if (!TentId) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Please provide TentId in params",
      })
    );
  }

  const tent = await TentDetails.findOne({ _id: TentId });

  if (!tent) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: "Tent not found",
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tent Retrieved Successfully",
      data: tent,
    })
  );
};

/** __________ Delete Tent By Manager __________ */
export const deleteTent = async (req, res) => {
  const { TentId } = req?.params;

  if (!TentId) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Please provide TentId in params",
      })
    );
  }

  const deletedTent = await TentDetails.findOneAndDelete({
    _id: TentId,
    UserId: req?.userId,
  });

  if (!deletedTent) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: "Tent not found",
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tent Deleted Successfully",
    })
  );
};

//////////////////////////////////
/**      Admin Controllers      */
//////////////////////////////////

/** __________ Add Tent __________ */
export const bookTentByAdmin = async (req, res) => {
  if (
    ![
      "Gadhpur Dham",
      "Vadtal Dham",
      "Dholera Dham Gents",
      "Dholera Dham Ladies",
      "Temple",
    ].includes(req?.body?.Name)
  ) {
    throw new BadRequestError("Please provide valid Name in body.");
  }
  const user = await Users.findOne({ Name: req?.body?.Name });
  const newTent = await TentDetails.create({
    ...req.body,
    UserId: user?._id,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Tent Booked Successfully",
      data: newTent,
    })
  );
};

/** __________ Count Tents By Admin __________ */
export const countTentsByAdmin = async (req, res) => {
  const { Name } = req?.params;

  if (!Name) {
    console.log("Please provide Name in params.");
    throw new BadRequestError("Please provide Name in params.");
  }

  const user = await Users.findOne({ Name }).select("TentRange");

  const totalTents = user.TentRange;

  const checkInTents = await TentDetails.find({
    UserId: user?._id,
    Status: "CheckedIn",
  }).countDocuments();

  const reservedTents = await TentDetails.find({
    UserId: user?._id,
    Status: "Reserved",
  }).countDocuments();

  const availableTents = totalTents - (checkInTents + reservedTents);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Counted Successfully",
      data: { totalTents, checkInTents, reservedTents, availableTents },
    })
  );
};

/** __________ Get All Tents By Admin __________ */
export const getAllTentsByAdmin = async (req, res) => {
  const { Name } = req?.params;

  if (!Name) {
    throw new BadRequestError("Please provide Name in params.");
  }

  const user = await Users.findOne({ Name });

  if (!user) {
    throw new NotFoundError("User not found with provided Name.");
  }

  const page = parseInt(req?.query?.page) || 1;
  const limit = parseInt(req?.query?.limit) || 10;
  const skip = (page - 1) * limit;

  const tents = await TentDetails.find({
    UserId: user?._id,
  })
    .sort({ TentNo: 1 })
    .skip(skip)
    .limit(limit);

  const totalTents = await TentDetails.countDocuments({
    UserId: user?._id,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Retrieved Successfully",
      data: {
        totalTents,
        page,
        limit,
        totalPages: Math.ceil(totalTents / limit),
        tents,
      },
    })
  );
};

/** __________ Update Tent By Admin __________ */
export const updateTentByAdmin = async (req, res) => {
  const { TentId } = req?.params;

  if (!TentId) {
    throw new NotFoundError("Please provide TentId in params.");
  }

  const updatedTent = await TentDetails.findOneAndUpdate(
    { _id: TentId },
    { $set: req.body },
    { new: true }
  );

  if (!updatedTent) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: "Tent not found",
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tent status updated successfully",
      data: updatedTent,
    })
  );
};

/** __________ Search Tent By Admin __________ */
export const searchTentByAdmin = async (req, res) => {
  const { text, Name } = req.params;

  if (!text || !Name) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message:
          "Search text (TentNo or GuestName) and Name are required in params",
      })
    );
  }

  const user = await Users.findOne({ Name });
  if (!user) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: `User not found with Name: ${Name}`,
      })
    );
  }

  const query = {
    UserId: user._id,
    $or: [
      { TentNo: parseInt(text) || 0 },
      {
        GuestName: {
          $elemMatch: { $regex: text, $options: "i" },
        },
      },
    ],
  };

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tents = await TentDetails.find(query)
    .sort({ TentNo: 1 })
    .skip(skip)
    .limit(limit);

  const totalTents = await TentDetails.countDocuments(query);

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tents Retrieved Successfully",
      data: {
        totalTents,
        page,
        limit,
        totalPages: Math.ceil(totalTents / limit),
        tents,
      },
    })
  );
};

/** __________ Delete Tent By Admin __________ */
export const deleteTentByAdmin = async (req, res) => {
  const { TentId } = req?.params;

  if (!TentId) {
    return res.status(400).json(
      new ApiResponce({
        statusCode: 400,
        message: "Please provide TentId in params",
      })
    );
  }

  const deletedTent = await TentDetails.findOneAndDelete({
    _id: TentId,
  });

  if (!deletedTent) {
    return res.status(404).json(
      new ApiResponce({
        statusCode: 404,
        message: "Tent not found",
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Tent Deleted Successfully",
    })
  );
};
