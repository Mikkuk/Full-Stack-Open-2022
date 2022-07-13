import Togglable from './Togglable'

import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, removeItem, username }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    let showWhenLogged = { display: blog.user === username ? 'none' : '' }

    const like = () => {
        addLike(blog.id,
            {
                'title': blog.title,
                'author': blog.author,
                'url': blog.url,
                'likes': blog.likes + 1
            })
    }

    const removeBlog = async () => {
        if (window.confirm(`Do you want to remove blog "${blog.title}"?`)) {
            removeItem(blog.id)
        }
    }

    return (
        <div id='blog' style={blogStyle}>
            {blog.title} {blog.author}
            <Togglable id='view' buttonLabel="view">
                <div>
                    {blog.url}
                    <br/>
                    likes: {blog.likes}
                    <button id='like-button' onClick={like}>like</button>
                    <div style={showWhenLogged}>
                        <button id='remove-button' onClick={() => removeBlog(blog.id, blog.title)}>
                        delete blog
                        </button>
                    </div>
                </div>
            </Togglable>
        </div>
    )}

Blog.displayName = 'Blog'

Blog.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired
}

export default Blog