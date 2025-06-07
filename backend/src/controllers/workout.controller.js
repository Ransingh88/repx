import { Exercise } from "../models/exercise.model.js"
import { User } from "../models/user.model.js"
import { WorkoutPlan } from "../models/workoutPlan.model.js"
import { WorkoutLog } from "../models/workoutlog.model.js"

const createWorkout = async (req, res) => {
  try {
    // Simulate exercise creation logic
    const {
      name,
      exerciseId,
      muscleGroup,
      equipment,
      suggestedSets,
      suggestedReps,
    } = req.body

    if (!name || !exerciseId) {
      return res
        .status(400)
        .json({ message: "Name and exerciseId are required" })
    }

    // Here you would typically save the exercise to the database
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
      return res.status(400).json({ message: "Exercise creation failed" })
    }

    res.status(201).json({
      message: "Exercise created successfully",
      data: exercise,
    })
  } catch (error) {
    console.error("Error during exercise creation:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const createWorkoutPlan = async (req, res) => {
  try {
    // Simulate workout plan creation logic
    const { userId, name, description, type, cycle, workoutDays } = req.body

    if (!userId || !name || !type || !cycle || !workoutDays) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Here you would typically save the workout plan to the database
    const newWorkoutPlan = {
      userId,
      name,
      description,
      type,
      cycle,
      workoutDays,
      ...req.body,
    }

    // Assuming WorkoutPlan is a Mongoose model
    const workoutPlan = await WorkoutPlan.create(newWorkoutPlan)

    if (!workoutPlan) {
      return res.status(400).json({ message: "Workout plan creation failed" })
    }

    console.log(workoutPlan._id, "workoutPlan")

    const user = await User.findByIdAndUpdate(
      userId,
      {
        currentPlanId: workoutPlan._id,
        selectedWorkoutType: workoutPlan.type,
      },
      { new: true }
    )

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    console.log("Created Workout Plan:", workoutPlan)

    res.status(201).json({
      message: "Workout plan created successfully",
      data: workoutPlan,
    })
  } catch (error) {
    console.error("Error during workout plan creation:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const workoutLog = async (req, res) => {
  try {
    // Simulate workout log creation logic
    const { userId, workoutTypeName, exercises } = req.body

    if (!userId || !workoutTypeName || !exercises) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Here you would typically save the workout log to the database
    const newWorkoutLog = {
      userId: userId,
      workoutTypeName,
      date: new Date(), // Default to current date
      exercises,
    }

    // Assuming WorkoutLog is a Mongoose model
    const workoutLog = await WorkoutLog.create(newWorkoutLog)

    if (!workoutLog) {
      return res.status(400).json({ message: "Workout log creation failed" })
    }

    res.status(201).json({
      message: "Workout log created successfully",
      data: workoutLog,
    })
  } catch (error) {
    console.error("Error during workout log creation:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export { createWorkout, createWorkoutPlan, workoutLog }
