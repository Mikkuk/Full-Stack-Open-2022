var _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {

    let totalLikes = 0
    blogs.forEach(blog => {
        totalLikes += blog.likes
    })

    return blogs.length === 0
    ? 0
    : totalLikes
}

const favoriteBlog = (blogs) => {

    let favoriteBlog = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > favoriteBlog.likes){
            favoriteBlog = blog
        }
    })

    const resultBlog = {
        title: favoriteBlog.title,
        author: favoriteBlog.author,
        likes: favoriteBlog.likes
    }
    return resultBlog 
}

const mostBlogs = (blogs) => {
    let mostBlogs = _.filter(blogs, { author: blogs[0].author })
    blogs.forEach(blog => {
        let i = _.filter(blogs, { author: blog.author })
        if (i.length > mostBlogs.length){
            mostBlogs = i
        }
    })

    const resultBlog = {
        author: mostBlogs[0].author,
        blogs: mostBlogs.length
    }
    return resultBlog 
}

const mostLikes = (blogs) => {
    let mostLikes = 0
    let author

    blogs.forEach(blog => {
        let authorBlogs = _.filter(blogs, { author: blog.author })
        let authorLikes = 0
        authorBlogs.forEach(authorBlog => {
            authorLikes += authorBlog.likes
        })
        if (authorLikes > mostLikes){
            mostLikes = authorLikes
            author = blog.author
        }
    })

    const resultAuthor = {
        author: author,
        likes: mostLikes
    }
    return resultAuthor 
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }