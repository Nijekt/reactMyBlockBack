import CommentModel from "../Models/CommentModel.js";
import PostModel from "../Models/PostModel.js";

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });

    await PostModel.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

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

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user");
    res.json(comments);
  } catch (error) {
    console.log(error);
  }
};
