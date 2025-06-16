import { twMerge } from "tailwind-merge"

const Input = ({
  label = "Label",
  placeholder = "e.g. Exercise Name",
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <p className="text-gray-700 text-sm font-normal">{label}</p>
      <input
        type="text"
        className={twMerge(
          "w-full bg-green-50 border border-green-100 px-2 py-2 rounded placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500",
          className
        )}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input
