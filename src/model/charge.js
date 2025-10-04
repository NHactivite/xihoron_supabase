import mongoose from "mongoose";

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: "singleton",
  },
  limit: {
    type: Number,
    default: 1000,
  },
  charge: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

if (mongoose.models.Charge) {
  delete mongoose.models.Charge;
}
export const Charge = mongoose.models.Charge || mongoose.model("Charge", schema);
