import express from "express"
import {
  createWorkout,
  createWorkoutPlan,
  workoutLog,
} from "../controllers/workout.controller.js"

const router = express.Router()

router.route("/createWorkout").post(createWorkout)
router.route("/createWorkoutPlan").post(createWorkoutPlan)
router.route("/workoutLog").post(workoutLog)

export default router
