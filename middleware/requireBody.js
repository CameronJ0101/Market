/** Checks if the request body contains the required fields */
export default function requireBody(requiredFields = []) {
  return function (req, res, next) {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).send("Request body is required.");
    }

    // Check that each required field exists
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).send(`Missing required field: ${field}`);
      }
    }

    next();
  };
}
