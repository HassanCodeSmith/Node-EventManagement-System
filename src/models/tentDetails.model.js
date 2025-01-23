import mongoose, { Schema } from "mongoose";

const tentDetailsSchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    TentNo: {
      type: Number,
      required: true,
      index: true,
    },

    TotalPersons: {
      type: Number,
      default: 4,
      min: 1,
      max: 5,
    },

    NeedExtraBed: {
      type: Boolean,
      default: false,
    },

    GuestName: [],

    PhoneNo: {
      type: String,
      unique: true,
    },

    Place: String,

    GuestType: {
      type: String,
      enum: ["VVIP", "VIP", "Supponser", "General"],
    },

    Days: Number,

    CheckInDate: {
      type: Date,
    },

    CheckOutDate: {
      type: Date,
      index: true,
    },

    IsTentClean: {
      type: Boolean,
      default: true,
    },

    Status: {
      type: String,
      enum: ["CheckedIn", "CheckedOut", "Reserved", "Pending", "Available"],
    },
  },
  { timestamps: true, collection: "TentDetails" }
);

export const TentDetails = mongoose.model("TentDetails", tentDetailsSchema);

/**
 * Dadhpur Dham: VVIP, VIP
 * Vadtal Dham: Supponser, General
 * Dholera Dham Gents + Ladies: VIP, Supponser
 */
