const Blog = require('../models/Blog');

// Create a new blog post (Admin only)
const createBlog = async (req, res) => {
  try {
    const { title, content, image, author } = req.body;
    const blog = new Blog({ title, content, image, author });
    await blog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all blog posts (Public)
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single blog post by ID (Public)
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a blog post (Admin only)
const updateBlog = async (req, res) => {
  try {
    const { title, content, image, author } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;
    blog.author = author || blog.author;
    await blog.save();
    res.json({ message: 'Blog post updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a blog post (Admin only)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    await blog.deleteOne();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
