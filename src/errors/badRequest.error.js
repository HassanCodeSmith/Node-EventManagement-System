import { CustomAPIError } from "./customError.error.js";

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message, 400);
  }
}

export { BadRequestError };
