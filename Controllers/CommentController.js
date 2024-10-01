import CommentModel from "../Models/CommentModel.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
  }
};

export const getAllComs = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user");

    res.json(comments);
  } catch (error) {
    console.log(error);
  }
};

export const getComsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find({ post: postId }).populate("user");

    res.json(comments);
  } catch (error) {
    console.log(error);
  }
};
