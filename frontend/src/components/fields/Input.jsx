import { twMerge } from "tailwind-merge"

const Input = ({
  label = "Label",
  placeholder = "e.g. Exercise Name",
  className = "",
  onChange = () => {},
  name,
  value = "",
  type = "text",
  labelVisible = true,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {labelVisible && (
        <p className="text-gray-700 text-sm font-normal">{label}</p>
      )}
      <input
        type={type}
        className={twMerge(
          "w-full bg-green-50 border border-green-100 px-2 py-2 rounded placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500",
          className
        )}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        name={name}
        value={value}
      />
    </div>
  )
}

export default Input
