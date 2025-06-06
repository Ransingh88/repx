import { Route, Routes } from "react-router"
import Home from "../pages/Home"
import Workout from "../pages/Workout"

const AppRoute = () => {
  return (
    <div className="@container  min-h-screen px-6 py-2 mt-12">
      <Routes>
        <Route index element={<Home />} />
        <Route path="workout-log" element={<Workout />} />
      </Routes>
    </div>
  )
}

export default AppRoute
