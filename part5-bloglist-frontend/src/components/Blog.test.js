import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog tests', () => {
    let container
    let onLike = jest.fn()

    beforeEach(() => {
        const blog = {
            title: 'test-title',
            author: 'test-author',
            url: 'test-url',
            likes: 2,
        }
        container = render(<Blog blog={blog} like={onLike} />)
    })

    test('renders title and author', () => {
        expect(container.container).toHaveTextContent(
            'test-title',
            'test-author'
        )
    })

    test('url and likes are displayed after clicking the view button', () => {
        const button = screen.getByText('view')
        userEvent.click(button)

        const div = container.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
        expect(container.container).toHaveTextContent('test-url', '2')
    })

    test('Event handler is called twice when like button is clicked twice', () => {
        const viewButton = screen.getByText('view')
        userEvent.click(viewButton)

        const likeButton = screen.getByText('like')
        userEvent.click(likeButton)
        userEvent.click(likeButton)

        expect(onLike.mock.calls).toHaveLength(2)
    })
})
