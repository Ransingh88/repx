import mongoose from "mongoose"

const exerciseLogSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: String,
      required: true,
    },
    sets: [
      {
        set: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      }
    ],
    notes: { type: String },
  },
  { _id: false } // Prevents creation of a separate _id for each exercise
)

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    workoutTypeName: { type: String },
    exercises: { type: [exerciseLogSchema] },
  },
  {
    timestamps: true,
  }
)

export const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema)
