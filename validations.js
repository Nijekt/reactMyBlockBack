import { body } from "express-validator";

export const registerValidation = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Min length is 5").isLength({ min: 5 }),
  body("fullName", "Min length is 2").isLength({ min: 2 }),
  body("avatarUrl", "").optional().isURL(),
];
export const loginValidation = [
  body("email", "This email is not found").isEmail(),
  body("password", "Password is incorrect").isLength({ min: 5 }),
];

export const createPostValidation = [
  body("title", "Min length 3").isLength({ min: 3 }).isString(),
  body("text", "Min length 5").isLength({ min: 3 }).isString(),
  body("tags", "Incorrect format").optional().isArray(),
  body("imageUrl", "Incorrect Link").optional().isString(),
];
export const updatePostValidation = [
  body("title", "Min length 3").isLength({ min: 3 }).isString(),
  body("text", "Min length 5").isLength({ min: 3 }).isString(),
  body("tags", "Incorrect format").optional(),
  body("imageUrl", "Incorrect Link").optional().isString(),
];
