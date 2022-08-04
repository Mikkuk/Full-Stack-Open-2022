import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

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
            <Form onSubmit={addBlog}>
                <Form.Group>
                    <Form.Label>title:{' '}</Form.Label>
                    <Form.Control
                        type='text'
                        name='title'
                        onChange={handleTitleChange}
                    />
                    <Form.Label>author:{' '}</Form.Label>
                    <Form.Control
                        type='text'
                        name='author'
                        onChange={handleAuthorChange}
                    />
                    <Form.Label>url:{' '}</Form.Label>
                    <Form.Control
                        type='text'
                        name='url'
                        onChange={handleUrlChange}
                    />
                    <Button id="submit-button" type="submit">
                        create
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default BlogForm
