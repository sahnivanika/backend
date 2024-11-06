import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js"; // Import the User model if you're associating the blog with a user.

// Get all blogs
export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find().populate('user');
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!blogs || blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found" });
    }
    return res.status(200).json({ blogs });
};

// Add a new blog
export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding user" });
    }
    if (!existingUser) {
        return res.status(400).json({ message: "Unable to Find User by this id" });
    }

    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });
        existingUser.blogs.push(blog);
        await existingUser.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error creating blog" });
    }
    return res.status(201).json({ blog });
};

// Update a blog by ID
export const updateBlog = async (req, res, next) => {
    const { title, description } = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
        }, { new: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to update the blog" });
    }
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ blog });
};

// Get a blog by ID
export const getBlogById = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding blog" });
    }
    if (!blog) {
        return res.status(404).json({ message: "No blog found" });
    }
    return res.status(200).json({ blog });
};

// Get blogs by user ID
export const getBlogsByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error finding user's blogs" });
    }
    if (!userBlogs || userBlogs.blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found for this user" });
    }
    return res.status(200).json({ user: userBlogs });
};

// Delete a blog by ID
export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(id).populate('user');
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        console.log("Error during deletion:", err);
        return res.status(500).json({ message: "Unable to delete blog" });
    }
    return res.status(200).json({ message: "Successfully Deleted" });
};
