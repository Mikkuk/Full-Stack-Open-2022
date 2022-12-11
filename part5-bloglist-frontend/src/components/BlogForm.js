import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url,
        })
        setAuthor('')
        setTitle('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                title:{' '}
                <input id="title" title={title} onChange={handleTitleChange} />
                <br />
                author:{' '}
                <input
                    id="author"
                    author={author}
                    onChange={handleAuthorChange}
                />
                <br />
                url: <input id="url" url={url} onChange={handleUrlChange} />
                <br />
                <button id="submit-button" type="submit">
                    create
                </button>
            </form>
        </div>
    )
}

export default BlogForm
