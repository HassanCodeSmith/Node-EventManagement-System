import { NotFoundError } from "../errors/notFound.error.js";

export const filterMissingFields = (requiredFields) => (req, res, next) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    if (missingFields.length > 1) {
      missingFields[missingFields.length - 1] = `and ${
        missingFields[missingFields.length - 1]
      }`;
    }

    throw new NotFoundError(`Please provide ${missingFields.join(", ")}`);
  } else {
    next();
  }
};
