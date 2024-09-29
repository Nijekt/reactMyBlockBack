import PostModel from "../Models/PostModel.js";

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Mistake with post creating",
    });
  }
};

export const removePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findByIdAndDelete(id);

    if (!post) {
      res.status(404).json({
        message: "Post is not definied",
      });
    }

    res.json({
      message: "Deleting was succesfull",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;

    PostModel.updateOne(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          text: req.body.text,
          tags: req.body.tags,
          imageUrl: req.body.imageUrl,
          user: req.userId,
        },
      }
    ).then((doc) => {
      if (!doc) {
        res.status(404).json({
          message: "Post is not found",
        });
      }
    });

    res.json({
      message: "Update successfelly",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Falied to update the post",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      id,
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: "after" }
    ).populate("user");
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user");

    res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5);

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
  }
};
