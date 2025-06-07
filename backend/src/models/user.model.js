import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    selectedWorkoutType: { type: String },
    currentPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
    settings: {
      units: { type: String, default: "metric" }, // metric or imperial
      nextWorkoutIndex: { type: Number, default: 0 },
    },
    profile: {
      age: { type: Number },
      goal: { type: String },
    },
    streakInfo: { type: mongoose.Schema.Types.ObjectId, ref: "Streak" },
  },
  {
    timestamps: true,
  }
)

export const User = mongoose.model("User", userSchema)
