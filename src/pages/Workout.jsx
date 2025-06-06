const workout_data = {
  workoutPlan: [
    {
      type: "PPL",
      workout: [
        {
          Push: {
            A: [
              "Bench Press",
              "Incline Dumbbell Press",
              "Cable Cross Fly",
              "Tricep Pushdown",
              "Lateral Raises",
            ],
            B: [
              "Flat Dumbbell Press",
              "Incline Dumbbell Press",
              "Pec Deck Fly",
              "Military Shoulder Press",
              "Front Dumbbell Raises",
            ],
          },
        },
        {
          Pull: {
            A: [
              "Deadlift",
              "Lat Pulldown",
              "Seated Cable Row",
              "Face Pulls",
              "Barbell Curl",
            ],
            B: [
              "Pull-Ups",
              "T-Bar Row",
              "Straight Arm Pulldown",
              "Hammer Curl",
              "Rear Delt Fly",
            ],
          },
        },
        {
          Leg: {
            A: [
              "Back Squat",
              "Leg Press",
              "Leg Curl",
              "Calf Raises",
              "Walking Lunges",
            ],
            B: [
              "Front Squat",
              "Romanian Deadlift",
              "Leg Extension",
              "Seated Calf Raise",
              "Bulgarian Split Squat",
            ],
          },
        },
      ],
    },
  ],
}

const Workout = () => {
  return (
    <div>
      <div>
             {" "}
        {workout_data.workoutPlan.map((plan, index) => (
          <div key={index}>
                      <h2>Workout: {plan.type}</h2>
                     {" "}
            {plan.workout.map((day, i) => {
              const [dayType, sessions] = Object.entries(day)[0]
              return (
                <div key={i}>
                                 {" "}
                  {Object.entries(sessions).map(([session, exercises], j) => (
                    <div key={j}>
                                         {" "}
                      <h3>
                        {dayType.toUpperCase()} {session}:
                      </h3>
                                         {" "}
                      <ul>
                                             {" "}
                        {exercises.map((exercise, k) => (
                          <li key={k}>- {exercise}</li>
                        ))}
                                           {" "}
                      </ul>
                                       {" "}
                    </div>
                  ))}
                               {" "}
                </div>
              )
            })}
                   {" "}
          </div>
        ))}
           {" "}
      </div>
       <div></div>
    </div>
  )
}

export default Workout
