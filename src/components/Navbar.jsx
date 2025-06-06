import { Link } from "react-router"

const navbar_menu = [
  {
    label: "workout",
    path: "/workout-log",
  },
  {
    label: "meal",
    path: "/meal-log",
  },
  {
    label: "about",
    path: "/about",
  },
]

const Navbar = () => {
  return (
    <div className="relative w-full ">
      <div className="bg-white fixed top-0 right-0 w-full h-12 flex justify-between items-center px-6 border-b border-gray-200">
        <div className="font-bold tracking-tight uppercase ">
          <Link to="/">FitTrack</Link>
        </div>
        <div>
          <ul className="flex gap-4 items-center justify-center">
            {navbar_menu.map((menu) => (
              <Link to={menu.path}>{menu.label}</Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
