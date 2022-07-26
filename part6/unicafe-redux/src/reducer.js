const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const changedGoodState = {
        ...state,
        good: state.good + 1
      }
      return changedGoodState
    case 'OK':
      const changedOkState = {
        ...state,
        ok: state.ok + 1
      }
      return changedOkState
    case 'BAD':
      const changedBadState = {
        ...state,
        bad: state.bad + 1
      }
      return changedBadState
    case 'ZERO':
      return initialState
    default: return state
  }
  
}

export default counterReducer