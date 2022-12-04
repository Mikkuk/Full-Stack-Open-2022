import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            author {
                name
                born
                bookCount
            }
            published
            genres
        }
    }
`

export const CREATE_BOOK = gql`
    mutation createBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
        addBook(
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            published
            author {
                name
            }
            id
            genres
        }
    }
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            id
            born
            bookCount
        }
    }
`
export const USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
        title
        author {
            name
            born
            bookCount
        }
        published
        genres
    }
  }
`