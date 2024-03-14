const Blog = require('.../models/blog')

const initialBlogs = [
    {
        title: 'aot',
        author: 'Levi',
        url: 'shingeki',
        likes: 1000
    },
    {
        title: 'mario',
        author: 'bowser',
        url: 'game',
        likes: 132
    }
]

const initialUser = { "username": "test1", "name": "test1", "password": "test1" }

const nonExistingId = async () => {
    const blog = new Blog({ content: 'willremovethissoon' })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
initialBlogs, initialUser, nonExistingId, blogsInDb
}