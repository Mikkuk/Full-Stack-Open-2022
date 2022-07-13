import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const Notification = ({ confirmationMessage, errorMessage }) => {
    const confirmationMessageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }
    const errorMessageStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }

    if (errorMessage === null && confirmationMessage === null) {
        return null
    }
    else if (errorMessage) {
        return (
            <div style={errorMessageStyle}>
                {errorMessage}
            </div>
        )
    }
    else if (confirmationMessage){
        return (
            <div style={confirmationMessageStyle}>
                {confirmationMessage}
            </div>
        )
    }
}


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [confirmationMessage, setConfimationMessage] = useState(null)
    const [user, setUser] = useState(null)
    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs))
    }, [])

    blogs.sort((blog1, blog2) => {
        return blog2.likes - blog1.likes
    })

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (expection) {
            setErrorMessage('wrong username or password')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
        console.log('logging in with', username, password)
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        try {
            blogService
                .create(blogObject)
                .then(returnedBlog => {
                    setBlogs(blogs.concat(returnedBlog))
                })
            setConfimationMessage('a new blog added')
            setTimeout(() => {
                setConfimationMessage(null)
            }, 5000)
        } catch (expection) {
            setErrorMessage(expection)
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <h2>log in to application</h2>
                username
                <input
                    type="text"
                    id='username'
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
            password
                <input
                    type="password"
                    id='password'
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id='login-button' type="submit">login</button>
        </form>
    )

    const addLike = (id, blogObject) => {
        blogService.update(id, blogObject)
            .then(blogService.getAll()
                .then(blogs => setBlogs(blogs)))
    }

    const removeItem = async (id) => {
        await blogService.removeBlog(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
    }
    return (
        <div>
            <Notification
                confirmationMessage={confirmationMessage}
                errorMessage={errorMessage}
            />
            {user === null ?
                loginForm() :
                <div>
                    <h2>blogs</h2>
                    <p>{user.username} logged in
                        <button onClick={() => window.localStorage.removeItem('loggedBlogappUser')}>log out</button>
                    </p>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                        <BlogForm createBlog={addBlog} />
                    </Togglable>
                    {blogs.map(blog =>
                        <Blog
                            key={blog.id}
                            blog={blog}
                            addLike={addLike}
                            removeItem={removeItem}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default App
