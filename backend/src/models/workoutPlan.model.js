import mongoose from "mongoose"

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // e.g., "Push/Pull/Legs"
    description: { type: String }, // e.g., "A 6-day workout plan focusing on strength and hypertrophy",
    type: { type: String, required: true }, // e.g., "PPL", "bro split", "single body part", etc.
    cycle: { type: Number, required: true }, // e.g., 6 days/week cycle
    workoutDays: [
      {
        day: { type: Number }, // e.g., 1 for Monday, 2 for Tuesday, etc.
        name: { type: String, }, // e.g., "Push Day", "Pull Day", etc.
        type: { type: String }, // Push, Pull, etc.
        exercises: [{ type: String, required: true }], // references to exercises
      },
    ],
    active: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
)

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema)
