import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import User from './components/User'
import usersService from './services/users'
import UserInfo from './components/UserInfo'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState(null)
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const blogFormRef = useRef()
    const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1)

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs.sort(byLikes)))
    }, [])

    useEffect(() => {
        const userFromStorage = userService.getUser()
        if (userFromStorage) {
            setUser(userFromStorage)
        }
    }, [])

    useEffect(() => {
        usersService.getAll().then((users) => setUsers(users))
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password,
            })

            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            )

            setUser(user)
            userService.setUser(user)
            setUsername('')
            setPassword('')
        } catch (expection) {
            notify('wrong username or password', 'alert')
        }
        console.log('logging in with', username)
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then((returnedBlog) => {
                notify('a new blog added')
                setBlogs(blogs.concat(returnedBlog))
            })
            .catch((error) => {
                notify('Failed: ' + error.response.data.error, 'alert')
            })
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                <h2>log in to application</h2>
                username
                <input
                    type="text"
                    id="username"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    id="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id="login-button" type="submit">
                login
            </button>
        </form>
    )

    const addLike = (id, blogObject) => {
        blogService.update(id, blogObject).then((updatedBlog) => {
            const updatedBlogs = blogs
                .map((b) => (b.id === id ? updatedBlog : b))
                .sort(byLikes)
            setBlogs(updatedBlogs)
        })
    }

    const logout = () => {
        setUser(null)
        userService.clearUser()
        notify('logged out!')
    }

    const removeItem = async (id) => {
        await blogService.removeBlog(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
    }

    const notify = (message, type = 'info') => {
        let timeoutId = null
        setNotification({ message, type })

        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    return (
        <div>
            <Notification notification={notification} />
            {user === null ? (
                loginForm()
            ) : (
                <Router>
                    <div className="container">
                        <h2>blogs</h2>
                        <Navbar
                            collapseOnSelect
                            expand="lg"
                            bg="dark"
                            variant="dark"
                        >
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav classname="mr-auto">
                                    <Nav.Link href="#" as="span">
                                        <Link to="/users">users </Link>
                                    </Nav.Link>
                                    <Nav.Link href="#" as="span">
                                        <Link to="/blogs">blogs </Link>
                                    </Nav.Link>
                                </Nav>
                                <Navbar.Text>
                                    {user.username} logged in
                                    <button onClick={logout}>log out</button>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Navbar>
                        <Routes>
                            <Route
                                path="/users"
                                element={<User users={users} />}
                            />
                            <Route
                                path="/users/:id"
                                element={<UserInfo users={users} />}
                            />
                        </Routes>
                        <Togglable buttonLabel="new blog" ref={blogFormRef}>
                            <BlogForm createBlog={addBlog} />
                        </Togglable>
                        {blogs.map((blog) => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                addLike={addLike}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>
                </Router>
            )}
        </div>
    )
}

export default App
