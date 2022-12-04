import { useEffect, useState } from 'react'
import { USER, ALL_BOOKS } from '../queries'

const Recommend = (props) => {
    const user = USER
    const allBooks = ALL_BOOKS

    const [genre, setgenre] = useState(null)
    const [books, setBooks] = useState([])
    const [booksList, setBooksList] = useState([])
  
    useEffect(() => {
      if (allBooks.data) {
        const books = allBooks.data.allBooks
        setBooks(books)
      }
    }, [allBooks])

    useEffect(() => {
        if (user.data) {
            setgenre(user.data.me.favoriteGenre)
        }
      }, [user])
    
      useEffect(() => {
        setBooksList(
          books.filter((b) => b.genres.indexOf(genre) !== -1)
        )
      }, [books, genre])
    
      if (!props.show) {
        return null
      }
    
      if (allBooks.loading)  {
        return <div>loading...</div>
      }

  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favorite genre {genre}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksList.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend