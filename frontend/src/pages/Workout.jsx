import { useState } from "react"
import Input from "../components/fields/Input"
import { Trash2 } from "lucide-react"

const Workout = () => {
  const [workout, setWorkout] = useState({
    workoutName: "",
    sets: [],
    reps: [],
    weight: "",
    duration: "",
  })
  const [workoutList, setWorkoutList] = useState([])
  const [noOfSets, setNoOfSets] = useState(1)

  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // If the field is sets or reps, we need to handle it as an array
    if (name === "sets" || name === "reps") {
      // Convert the value to an array if it's not already
      const currentValues = workout[name] || []
      // Update the specific index based on the number of sets
      currentValues[noOfSets - 1] = value
      setWorkout((prev) => ({
        ...prev,
        [name]: currentValues,
      }))
      return
    }

    setWorkout((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddWorkout = () => {
    // Logic to add the workout to the database or state
    // console.log("Workout added:", workout)
    setWorkoutList((prev) => [...prev, workout])
    // Reset the form after adding
    setWorkout({
      workoutName: "",
      sets: [],
      reps: [],
      weight: "",
      duration: "",
    })
    setNoOfSets(1)
  }
  const handleAddSet = () => {
    setNoOfSets((prev) => prev + 1)
  }

  const handleDeleteSet = (index) => {
    setWorkout((prev) => {
      const updatedSets = prev.sets.filter((_, i) => i !== index)
      const updatedReps = prev.reps.filter((_, i) => i !== index)
      return {
        ...prev,
        sets: updatedSets,
        reps: updatedReps,
      }
    })
    setNoOfSets((prev) => Math.max(1, prev - 1))
  }

  const handleDeleteWorkout = (index) => {
    setWorkoutList((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="px-16 py-8">
      <div>
        <h1 className="text-2xl font-bold">Log Workout</h1>
        <p className="text-gray-400 text-sm">
          Record your workout for today {formattedDate}
        </p>
      </div>
      <div>
        <div className="mt-6  w-2/4">
          <Input
            label="Workout Name"
            placeholder="e.g. Push Ups"
            className="w-1/2"
            onChange={handleChange}
            name="workoutName"
            value={workout.workoutName}
          />
          {new Array(noOfSets).fill(0).map((_, index) => {
            if (index === 0) {
              return (
                <div key={index} className="w-1/2 flex gap-2">
                  <Input
                    label="Sets"
                    placeholder={`e.g. ${index + 1}`}
                    className=""
                    type="number"
                    onChange={handleChange}
                    name="sets"
                    value={workout.sets[index] || "1"}
                  />
                  <Input
                    label="Reps"
                    placeholder="e.g. 12"
                    className=""
                    onChange={handleChange}
                    name="reps"
                    value={workout.reps[index] || "12"}
                  />
                </div>
              )
            } else {
              return (
                <div className="flex items-center gap-2" key={index}>
                  <div key={index} className="w-1/2 flex gap-2">
                    <Input
                      label="Sets"
                      placeholder={`e.g. ${index + 1}`}
                      className=""
                      type="number"
                      onChange={handleChange}
                      name="sets"
                      value={workout.sets[index] || index + 1}
                      labelVisible={false}
                    />
                    <Input
                      label="Reps"
                      placeholder={`e.g. ${index + 1}0`}
                      className=""
                      onChange={handleChange}
                      name="reps"
                      value={workout.reps[index] || "12"}
                      labelVisible={false}
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteSet(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer mb-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            }
          })}
          {/* <div className="w-1/2 flex gap-2">
            <Input
              label="Sets"
              placeholder="e.g. 3"
              className=""
              onChange={handleChange}
              name="sets"
              value={workout.sets}
            />
            <Input
              label="Reps"
              placeholder="e.g. 10"
              className=""
              onChange={handleChange}
              name="reps"
              value={workout.reps}
            />
          </div> */}
          <button
            onClick={handleAddSet}
            className="bg-blue-500 text-white p-2 py-0.5 cursor-pointer hover:bg-blue-400 rounded mb-4 w-1/2"
          >
            add set
          </button>
          <Input
            label="Weight(lbs)"
            placeholder="e.g. 30"
            className="w-1/2"
            onChange={handleChange}
            name="weight"
            value={workout.weight}
          />
          <Input
            label="Duration(minute)"
            placeholder="e.g. 10 mins"
            className="w-1/2"
            onChange={handleChange}
            name="duration"
            value={workout.duration}
          />
          <button
            onClick={handleAddWorkout}
            className="p-4 py-1.5 rounded-lg bg-[#0cf20c] text-sm w-2/4 justify-self-end hover:bg-[#0cf20c]/80 transition-all duration-200 mt-4 cursor-pointer"
          >
            Add Workout
          </button>
        </div>
        <div>
          <h2>Workout Summary</h2>
          {workoutList.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <table className="table-auto">
              <thead className="">
                <tr>
                  <td>Workout Name</td>
                  <td>Sets</td>
                  <td>Reps</td>
                  <td>Weight</td>
                  <td>Duration</td>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {workoutList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.workoutName}</td>
                    <td>{item.sets}</td>
                    <td>{item.reps}</td>
                    <td>{item.weight}</td>
                    <td>{item.duration}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteWorkout(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Workout
