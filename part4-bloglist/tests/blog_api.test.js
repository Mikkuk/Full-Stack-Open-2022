const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { response } = require('../app')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is right amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

test('blog id field is named as id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toBeDefined()
})

test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'test blog77',
      auothor: 'test person',
      url: 'test.url',
      likes: '1'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)

  })

test('if likes field is empty value is 0', async () => {
  const newBlog = {
    title: 'test blog likes empty',
    author: 'test person',
    url: 'test.url',
    likes: ''
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(n => n.likes)
  expect(contents).toContain(0)
  expect(contents).not.toContain('')

})

test('fails with satus code 400 if title and url fields are empty', async () => {
  const newBlog = {
    author: 'test person',
    likes: ''
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length) 
})

test('Blog can be deleted', async () => {
  const blogToDelete = initialBlogs[0]

  await api
  .delete(`/api/blogs/${blogToDelete._id}`)
  .expect(204)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length - 1) 
}) 

test('blog can be edited', async () => {
  const blogToEdit = initialBlogs[0]

  let updatedLikesValue = blogToEdit.likes + 1

  await api
  .put(`/api/blogs/${blogToEdit._id}`)
  .send({
    likes: updatedLikesValue
  })
  .expect(200)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
  const contents = response.body.map(n => n.likes)
  expect(contents).toContain(updatedLikesValue)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testter1',
      name: 'tester',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test22',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
}) 