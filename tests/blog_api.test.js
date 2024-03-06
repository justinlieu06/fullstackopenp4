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

test('blogs are returned as json', async () => {
  await api
    .get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// correct location?
test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 2)
})

test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})