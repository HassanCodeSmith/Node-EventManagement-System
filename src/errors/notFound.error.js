import { CustomAPIError } from "./customError.error.js";

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message, 404);
  }
}

export { NotFoundError };
