import express from "express";
import mongoose from "mongoose";
import {
  createPostValidation,
  loginValidation,
  registerValidation,
} from "./validations.js";
import { validationResult } from "express-validator";
import {
  CommentController,
  PostController,
  UserController,
} from "./Controllers/index.js";
import checkAuth from "./utils/checkAuth..js";
// import { register } from "./Controllers/UserController.js";
import cors from "cors";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";
import multer from "multer";

mongoose
  .connect("mongodb+srv://nikita:nikitagts@clusterblog.euiko.mongodb.net/blog")
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERR", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.post(
  "/auth/register",
  registerValidation,
  handleValidationsErrors,
  UserController.register
);

app.post("/auth/login", loginValidation, UserController.login);

app.get("/auth/getAuth", checkAuth, UserController.getAuth);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  createPostValidation,
  handleValidationsErrors,
  PostController.createPost
);
app.get("/posts/getAll", PostController.getAllPosts);

app.get("/posts/:id", PostController.getOnePost);

app.patch("/posts/:id", checkAuth, PostController.updatePost);

app.delete("/posts/:id", checkAuth, PostController.removePost);

app.get("/tags", PostController.getLastTags);

app.get("/comments/getAll", CommentController.getAllComs);

app.post("/comments/:id", checkAuth, CommentController.createComment);

app.get("/comments/:id", checkAuth, CommentController.getComsByPost);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log("Server OK");
});
