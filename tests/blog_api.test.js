import bcrypt from 'bcrypt'

const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { Blog } = require('../models/blogs')
const { User } = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(helper.initialUser.password, saltRounds)

    const user = new User({
        "username": helper.initialUser.username,
        "name": helper.initialUser.name,
        passwordHash,
    })
    const savedUser = await user.save()

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    awaitPromise.all(promiseArray)
})

/* can run just the "only" tests by using npm test -- --test-only
another option is to remove only and specify in command line which tests to run such as npm test -- tests/blog_api.test.js which only runs tests in blog_api

The --tests-by-name-pattern option can be used for running tests with a specific name:
npm test -- --test-name-pattern="the first blog is about HTTP methods"

You can also just run tests that have blogs in the name:
npm run test -- --test-name-pattern="notes"
*/
test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    // assert.strictEqual(response.body.length, helper.initialBlogs.length)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

// correct location?
test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'async/await simplifies making async calls',
        author: '148031092',
        url: 'dasl',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const contents = blogsAtEnd.map(n => n.content)

    assert(contents.includes('async/await simplifies making async calls'))
})

test('blog without title is not added', async () => {
    const newBlog = {
        author: '183200094'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})