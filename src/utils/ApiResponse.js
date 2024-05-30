export default class ApiResponse {
  constructor(statusCode, data, status = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.status = status;
  }
}
