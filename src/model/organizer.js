import mongoose from "mongoose";

const OganizerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    role: {
      type: String,
      required: [true, "Please enter role"],
    },
    photo: 
      {
        url: String,
        public_id: String,
      },
    
  },
  { timestamps: true }
);

// if (mongoose.models.Oganizer) {
//   delete mongoose.models.Oganizer;
// }
export const Oganizer =mongoose.models.Oganizer || mongoose.model("Oganizer", OganizerSchema);
