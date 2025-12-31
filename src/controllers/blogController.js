const BlogPost = require("../models/blogPost");
const asyncHandler = require("../utils/asyncHandler");
const { uploadFromBuffer } = require("../utils/cloudinary");

exports.getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await BlogPost.countDocuments();

  res.json({
    data: posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.json(post);
});

exports.createBlog = asyncHandler(async (req, res) => {
  if (req.file) {
    const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);
    if (cloudinaryResponse) {
      req.body.imageUrl = cloudinaryResponse.secure_url;
    }
  }

  const post = await BlogPost.create(req.body);
  res.status(201).json(post);
});

exports.updateBlog = asyncHandler(async (req, res) => {
  if (req.file) {
    const cloudinaryResponse = await uploadFromBuffer(req.file.buffer);
    if (cloudinaryResponse) {
      req.body.imageUrl = cloudinaryResponse.secure_url;
    }
  }

  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.json(post);
});

exports.deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.status(204).end();
});


