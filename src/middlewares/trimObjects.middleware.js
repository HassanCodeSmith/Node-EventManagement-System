import { NotFoundError } from "../errors/index.errors.js";

/** __________ Trim Middleware for Nested Fields in Objects __________ */
export const trimObjects = (req, res, next) => {
  const emptyFields = [];

  const trimFields = (obj, path = "") => {
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof obj[key] === "string") {
          obj[key] = obj[key].trim();
          if (obj[key] === "") {
            emptyFields.push(currentPath);
          }
        } else if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map((item, index) =>
            trimFields(item, `${currentPath}[${index}]`)
          );
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          trimFields(obj[key], currentPath);
        }
      }
    }
    return obj;
  };

  req.body = trimFields(req.body);

  if (emptyFields.length > 0) {
    if (emptyFields.length > 1) {
      emptyFields[emptyFields.length - 1] = `and ${
        emptyFields[emptyFields.length - 1]
      }`;
    }

    throw new NotFoundError(`Please fill ${emptyFields.join(", ")}`);
  }

  next();
};
