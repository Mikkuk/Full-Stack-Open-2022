import React from 'react'

const Header = (props) => {
    console.log(props)
    return (
      <div>
        <h1>
          {props.header}
        </h1>
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part} {props.exercises}
        </p>
      </div>
    )
  }
  
  const Content = ({ course }) => {
    
    return (
      <div>
        <ul>
          {course.parts.map(part => 
            <li key={part.id}>
              <Part part={part.name} exercises={part.exercises} />
              
            </li>
          )}
        </ul>
      </div>
    )
  }
  
  const Course = ({ course }) => {
    console.log(course)
  
    return (
      <div>
        <Header header={course.name} />
        <Content course={course} />
        <Total exercises={course.parts.map(part => part.exercises)} />
      </div>
    )
  }
  
  const Total = ({ exercises }) => {
    console.log(exercises)
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    return (
      <div>
        <p>
          Total of {exercises.reduce(reducer)} exercises 
        </p>
      </div>
    )
  }

export default Course