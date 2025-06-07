import mongoose from "mongoose"

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentStreak: { type: Number, required: true },
    longestStreak: { type: Number, required: true },
    skippedDates: { type: [Date], required: true },
    completedDates: { type: [Date], required: true },
    lastWorkoutDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

export const Streak = mongoose.model("Streak", streakSchema)
