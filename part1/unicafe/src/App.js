import React, { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            {props.text} {props.value} {props.text2}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const Statistics = (props) => {
  if (props.statistics[0] + props.statistics[1] + props.statistics[2] === 0){
    return (
      <div>
      No feedback given
    </div>
    )
  }
  return (
    <div>
      <StatisticLine text="good" value = {props.statistics[0]} />
      <StatisticLine text="neutral" value = {props.statistics[1]} />
      <StatisticLine text="bad" value = {props.statistics[2]} />
      <StatisticLine text="all" value = {props.statistics[0] + props.statistics[1] + props.statistics[2]} />
      <StatisticLine text="average" value = {props.statistics[3]} />
      <StatisticLine text="positive" value = {props.statistics[4]} text2="%" />
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  const Average = ((good*1 + bad*-1) / (good + neutral + bad))

  const Positive = (good*1 / (good + neutral + bad) *100)

  const stats = [good, neutral, bad, Average, Positive]

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => handleGoodClick()} text="good"/>
      <Button handleClick={() => handleNeutralClick()} text="neutral"/>
      <Button handleClick={() => handleBadClick()} text="bad"/>
      <h1>Statistics</h1>
      <Statistics statistics={stats} />
    </div>

  )
}

export default App