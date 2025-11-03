import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  eventDateTime: {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeZone: { type: String, default: "IST" },
    registrationLastdate: { type: String, required: true },
    registrationTime: { type: String, required: true },
  },

  teamSize: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    teamLeadRequired: { type: Boolean, default: true },
  },

  poster: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "At least one poster must be uploaded",
    },
  },

  prize: {
    type: [
      {
        money: { type: String, required: true },
        prize: { type: String, required: true },
        place: { type: String, required: true },
      },
    ],
    validate: {
      validator: function (value) {
        return value.length > 0;
      },
      message: "At least one prize must be specified",
    },
  },

  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
    required: true,
  },

  participationFee: {
    perTeam: { type: Number, required: true },
    currency: { type: String, default: "INR", required: true },
    includes: { type: [String], default: [], required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

// if (mongoose.models.Event) {
//   delete mongoose.models.Event;
// }

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
