const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
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

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
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