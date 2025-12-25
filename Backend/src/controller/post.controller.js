const Post = require("../models/post");
const getPostList = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate("author_id", "username email name")
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Post.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: posts,
    });
  } catch (error) {
    console.error("getPostList error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const postDetails = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide post id" });
    }
    const post = await Post.findById(id).populate(
      "author_id",
      "username email name"
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("postDetails error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  console.log(req.body);

  const user = req.user;
  try {
    if (!user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, please check your login first",
      });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const postData = await Post.create({ title, content, author_id: user.id });
    return res
      .status(201)
      .json({ success: true, message: "Post created", data: postData });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  try {
    if (!user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, please check your login first",
      });
    }
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide post id" });
    }
    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.author_id.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, please check your login first",
      });
    }
    await Post.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const editPost = async (req, res) => {
  const {id}= req.params;
  const { title, content } = req.body;
  const user = req.user;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.author_id.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, please check your login first",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    return res
      .status(200)
      .json({ success: true, message: "Post updated", data: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const userPostList = async (req, res) => {
  const user = req.user;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  try {
    if (!user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, please check your login first",
      });
    }
    const posts = await Post.find({ author_id: user.id })
      .populate("author_id", "username email name")
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const total = await Post.countDocuments({ author_id: user.id });
    return res.status(200).json({
      success: true,
      meta: {
        total : total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
module.exports = {
  getPostList,
  createPost,
  removePost,
  editPost,
  postDetails,
  userPostList,
};
