import bcrypt from "bcrypt";
import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import PostModel from "../Models/PostModel.js";

export const register = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   console.log(errors);
    //   return res.json({
    //     errors: errors.array(),
    //   });
    // }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Can not create account",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        message: "User is not found",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.json({
        message: "User or password is incorrect",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "30d" });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Can not login to acc",
    });
  }
};

export const getAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        message: "User is not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(404).json({
      message: "User in not found",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    const posts = await PostModel.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .populate("user");

    const { passwordHash, ...userData } = user._doc;

    res.json({ userData, posts });
  } catch (error) {
    console.log(error);
  }
};

export const updateUserPhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      avatarUrl: req.body.avatarUrl,
    });

    if (!updatedUser) {
      return res.json({
        message: "User is not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};
