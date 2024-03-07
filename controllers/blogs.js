const express = require("express");
const { response } = require("../app");
const { Blog } = require("../models/blogs");

const blogsRouter = express.Router();

// blogsRouter.get("/", (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

blogsRouter.get("/", async(request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
})

// blogsRouter.post("/", (request, response) => {
//   const blog = new Blog(request.body);

//   blog.save().then((result) => {
//     response.status(201).json(result);
//   });
// });

blogsRouter.post("/", async(request, response) => {
    const blogs = new Blog(request.body);

    await blogs.save();
    response.status(201).json(result);
})

exports.blogsRouter = blogsRouter;