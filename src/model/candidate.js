import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    details: {
    name: {
      type: String, // e.g., "December 15, 2024"
      required: true,
    },
    emailId: {
      type: String, // e.g., "9:00 AM"
      required: true,
    },
    phoNo: {
      type: String, // e.g., "6:00 PM"
      required: true,
    }
  },
   Event: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    }
  },
    amount: {
      type: String,
    required: true,
    },
    user_Id: {
    type: String,
    required: true,
    },
    userName: {
      type: String,
      required: true,
    },
     candidate_Id: {
      type: String,
      required: true,
    },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// if (mongoose.models.Candidate) {
//   delete mongoose.models.Candidate;
// }
export const Candidate = mongoose.models.Candidate  || mongoose.model("Candidate", candidateSchema);
