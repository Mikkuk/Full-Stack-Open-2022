import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const addBlog = jest.fn()

    const container = render(<BlogForm addBlog={addBlog} />)

    const input = container.container.querySelector('new blog')
    const sendButton = screen.getByText('create')

    userEvent.type(input, 'testing a form...')
    userEvent.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].content).toBe('testing a form...')
})