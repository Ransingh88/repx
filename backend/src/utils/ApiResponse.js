class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode
    this.success = statusCode < 400
    this.message = message
    this.data = data
  }
}
export { ApiResponse }
// Usage example:
// const response = new ApiResponse(200, { id: 1, name: "John Doe" }, "User found");