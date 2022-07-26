import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
     updateAnecdote(state, action) {
        const id = action.payload.id
        const anecdoteToChange = state.find(n => n.id === id)
        const changedAnecdote = {
            ...anecdoteToChange,
            votes: anecdoteToChange.votes + 1
            }
        return state.slice()
        .sort((a,b) => a.votes < b.votes ? 1:-1)
        .map(anecdote =>anecdote.id !== id ? anecdote : changedAnecdote
     )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = content => {
  return async dispatch => {
    const changedAnecdote = await anecdoteService.update(content)
    dispatch(updateAnecdote(changedAnecdote))
  }
}

export default anecdoteSlice.reducer