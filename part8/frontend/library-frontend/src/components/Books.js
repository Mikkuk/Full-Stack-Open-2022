import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries'
const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState([])
  const [booksList, setBooksList] = useState([])
  const [booksByGenre, setBooksByGenre] = useState([])

  useEffect(() => {
    if (result.data) {
      const books = result.data.allBooks
      setBooksList(books)
      let genres = ['All genres']
      books.forEach((element) => {
        element.genres.forEach((g) => {
          if (genres.indexOf(g) === -1) {
            genres.push(g)
          }
        })
      })
      setGenres(genres)
      setSelectedGenre('All genres')
    }
  }, [result])

  useEffect(() => {
    if (selectedGenre === 'All genres') {
      setBooksByGenre(booksList)
    } else {
      setBooksByGenre(
        booksList.filter((b) => b.genres.indexOf(selectedGenre) !== -1)
      )
    }
  }, [booksList, selectedGenre])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      <div>in genre {selectedGenre}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      {genres.map(genre => 
        <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>
      )}
      </div>
    </div>
  )
}

export default Books
