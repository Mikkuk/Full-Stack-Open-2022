import React, { useEffect } from 'react'
import { voteAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { useSelector, useDispatch } from 'react-redux'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.filter ? 
      state.anecdotes.filter(a => a.content.includes(state.filter)):
      state.anecdotes
    )

    const sortedAnecdotes = [...anecdotes].sort((a1, a2) => a2.votes - a1.votes)
    
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(initializeAnecdotes())
    }, [dispatch])
  
    const vote = (id) => {
      console.log('vote', id)
      const theAnecdote = anecdotes.find(a => a.id === id)
      dispatch(voteAnecdote(theAnecdote))
      const message = `You voted anecdote: "${anecdotes.find(a => a.id === id).content}"`
      dispatch(createNotification(message, 5))
    }

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList