import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

it('when blog is created, callback has correct data', () => {
    const onCreate = jest.fn()
    render(<BlogForm onCreate={onCreate} />)

    const blogToCreate = {
        author: 'tester',
        title: 'Testblog',
        url: 'testurl',
    }

    const authorInput = screen.getByPlaceholderText('')
    userEvent.type(authorInput, blogToCreate.author)

    const titleInput = screen.getByPlaceholderText('')
    userEvent.type(titleInput, blogToCreate.title)

    const urlInput = screen.getByPlaceholderText('')
    userEvent.type(urlInput, blogToCreate.url)

    const createButton = screen.getByText('new blog')
    userEvent.click(createButton)

    expect(onCreate.mock.calls[0][0]).toEqual(blogToCreate)
})
