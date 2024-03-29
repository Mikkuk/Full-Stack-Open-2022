import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'

const Blogs = () => {
    const blogs = useSelector((state) => state.blogs)

    return (
        <div>
            <h2>blogs</h2>
            <div id="blogs">
                {blogs.map((blog) => (
                    <div key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>
                            {blog.title} by {blog.author}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Blogs
