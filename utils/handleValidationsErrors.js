import { validationResult } from "express-validator";
export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.json({
      errors: errors.array(),
    });
  }
  next();
};
