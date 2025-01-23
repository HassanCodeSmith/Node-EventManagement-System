import { CustomAPIError } from "./customError.error.js";

class UnAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message, 401);
  }
}

export { UnAuthenticatedError };
