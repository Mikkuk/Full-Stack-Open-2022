const blogsRouter = require('express').Router()
const { request, response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = request.user
    const blog = new Blog({ ...request.body, user: user.id })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const blogToReturn = await Blog.findById(savedBlog._id).populate('user', {
        username: 1,
        name: 1,
    })

    response.status(201).json(blogToReturn)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete) {
        return response.status(204).end()
    }

    if (blogToDelete.user && blogToDelete.user.toString() !== request.user.id) {
        return response.status(401).json({
            error: 'only creator can delete the blog',
        })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then((updatedBlog) => {
            response.json(updatedBlog)
        })
        .catch((error) => next(error))
})

blogsRouter.put('/:id/comments', (request, response) => {
  const body = request.body

  const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then((updatedBlog) => {
          response.json(updatedBlog)
      })
      .catch((error) => next(error))
})

module.exports = blogsRouter
