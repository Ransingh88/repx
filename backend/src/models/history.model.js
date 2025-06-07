import mongoose from "mongoose"

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    lastWorkoutDate: { type: Date, required: true },
    history: [
      {
        date: { type: Date, required: true, default: Date.now },
        status: { type: String, required: true }, // e.g., "completed", "skipped"
      },
    ],
  },
  {}
)

export const History = mongoose.model("History", historySchema)
