const { test, after, beforeEach } = require('node:test')
const Person = require('.../models/person')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialPersons = [
    {
        name: 'Levi',
        number: '101520',
    },
    {
        name: 'Bowser',
        number: '185043'
    }
]

beforeEach(async () => {
    await Person.deleteMany({})
    let personObject = new Person(initialPersons[0])
    await personObject.save()
    personObject = new Person(initialPersons[1])
    await personObject.save()
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

// correct location?
test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialPersons.length)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})