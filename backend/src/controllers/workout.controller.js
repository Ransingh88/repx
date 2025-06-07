import { Exercise } from "../models/exercise.model.js"
import { History } from "../models/history.model.js"
import { User } from "../models/user.model.js"
import { WorkoutPlan } from "../models/workoutPlan.model.js"
import { WorkoutLog } from "../models/workoutlog.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createWorkout = asyncHandler(async (req, res) => {
  const {
    name,
    exerciseId,
    muscleGroup,
    equipment,
    suggestedSets,
    suggestedReps,
  } = req.body

  if (!name || !exerciseId) {
    throw new ApiError(400, "Validation Error", [
      "Name and Exercise ID are required",
    ])
  }

  const newExercise = {
    exerciseId,
    name,
    muscleGroup,
    equipment,
    suggestedSets,
    suggestedReps,
  }

  const exercise = await Exercise.create(newExercise)

  if (!exercise) {
    throw new ApiError(400, "Exercise creation failed")
  }

  res
    .status(201)
    .json(new ApiResponse(201, exercise, "Exercise created successfully"))
})

const createWorkoutPlan = asyncHandler(async (req, res) => {
  const { userId, name, description, type, cycle, workoutDays } = req.body

  if (!userId || !name || !type || !cycle || !workoutDays) {
    throw new ApiError(400, "Validation Error", ["all fields are required"])
  }

  const newWorkoutPlan = {
    userId,
    name,
    description,
    type,
    cycle,
    workoutDays,
    ...req.body,
  }

  const workoutPlan = await WorkoutPlan.create(newWorkoutPlan)

  if (!workoutPlan) {
    throw new ApiError(400, "Workout plan creation failed")
  }

  // Update user's current plan and selected workout type
  const user = await User.findByIdAndUpdate(
    userId,
    {
      currentPlanId: workoutPlan._id,
      selectedWorkoutType: workoutPlan.type,
    },
    { new: true }
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, workoutPlan, "Workout plan created successfully")
    )
})

const workoutLog = asyncHandler(async (req, res) => {
  const { userId, workoutTypeName, exercises } = req.body

  if (!userId || !workoutTypeName || !exercises) {
    throw new ApiError(400, "Validation Error", [
      "User ID, workout type name, and exercises are required",
    ])
  }

  // check if user log workout today
  const today = new Date().toISOString().split("T")[0]
  const existingLog = await WorkoutLog.findOne({
    userId: userId,
    date: today,
  })

  if (existingLog) {
    throw new ApiError(400, "Workout log for today already exists")
  }

  const newWorkoutLog = {
    userId: userId,
    workoutTypeName,
    // Default to current date in yyyy-mm-dd format
    date: new Date().toISOString().split("T")[0],
    exercises,
  }

  const workoutLog = await WorkoutLog.create(newWorkoutLog)

  if (!workoutLog) {
    throw new ApiError(400, "Workout log creation failed")
  }

  // update history
  await History.findByIdAndUpdate(
    userId,
    {
      $push: {
        history: {
          date: new Date(),
          status: "completed", // or "skipped" based on your logic
        },
      },
      lastWorkoutDate: new Date(),
    },
    { new: true, upsert: true } // Create if not exists
  )

  res
    .status(201)
    .json(new ApiResponse(201, workoutLog, "Workout log created successfully"))
})

export { createWorkout, createWorkoutPlan, workoutLog }
