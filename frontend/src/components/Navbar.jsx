import { Link } from "react-router"
import { Bell, User } from "lucide-react"

const navbar_menu = [
  {
    label: "dashboard",
    path: "/dashboard",
  },
  {
    label: "workout",
    path: "/workout",
  },
  {
    label: "meal",
    path: "/meal",
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
        <div className="font-bold tracking-tight ">
          <Link to="/">repx.</Link>
        </div>
        <div className="flex justify-between items-center gap-4">
          <div>
            <ul className="flex gap-4 items-center justify-center capitalize text-sm">
              {navbar_menu.map((menu) => (
                <Link to={menu.path}>{menu.label}</Link>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Bell size={16} />
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
