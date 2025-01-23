import { CustomAPIError } from "./customError.error.js";

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message, 409);
  }
}

export { ConflictError };
