import mongoose from "mongoose"

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: String, required: true, unique: true }, // Unique identifier for the exercise e.g., "ex12345"
    name: { type: String, required: true }, // e.g., Bench Press, Squat
    muscleGroup: { type: [String], required: true }, // e.g., Chest, Back, Legs
    equipment: { type: String }, // e.g., Dumbbell, Barbell, Bodyweight
    suggestedSets: { type: Number, default: 3 },
    suggestedReps: { type: Number, default: 12 },
  },
  {
    timestamps: true,
  }
)

export const Exercise = mongoose.model("Exercise", exerciseSchema)


// Chest: ch - 001, ch - 002
// Back: bk - 001, bk - 002
// Shoulders: sh - 001, sh - 002
// Triceps: tr - 001, tr - 002
// Biceps: bi - 001, bi - 002
// Quads: qd - 001, qd - 002
// Glutes: gl - 001, gl - 002
// Hamstrings: hm - 001, hm - 002
// Calves: cv - 001, cv - 002