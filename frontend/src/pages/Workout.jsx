import Input from "../components/fields/Input"

const Workout = () => {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="px-16 py-8">
      <div>
        <h1 className="text-2xl font-bold">Log Workout</h1>
        <p className="text-gray-400 text-sm">
          Record your workout for today {formattedDate}
        </p>
      </div>
      <div className="mt-6  w-2/4">
        <Input
          label="Workout Name"
          placeholder="e.g. Push Ups"
          className="w-1/2"
        />
        <div className="w-1/2 flex gap-2">
          <Input label="Sets" placeholder="e.g. 3" className="" />
          <Input label="Reps" placeholder="e.g. 10" className="" />
        </div>
        <Input label="Weight(lbs)" placeholder="e.g. 30" className="w-1/2" />
        <Input
          label="Duration(minute)"
          placeholder="e.g. 10 mins"
          className="w-1/2"
        />
      </div>
      <button>Add Workout</button>
    </div>
  )
}

export default Workout
