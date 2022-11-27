import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR} from '../queries'
const Authors = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const [ changeBorn ] = useMutation(EDIT_AUTHOR,  {
    refetchQueries: [ { query: ALL_AUTHORS } ] 
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    changeBorn({ variables: { name, setBornTo } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((a) => (
              <option key={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born <input
            value={setBornTo}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
