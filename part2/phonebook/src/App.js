import { useState, useEffect } from 'react'
import personService from './services/persons'


const Persons = (props) => {
  return (
    <ul>
      {props.persons.map((person => (
        <li key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => props.deleteperson(person)}>delete</button>
        </li>
      )))
    }
  </ul>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input filtername={props.filterName} 
      onChange={props.handleFilterNameChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.onSubmit}>
        <div>
          name: <input name={props.newName} 
          onChange={props.handleNameChange} 
          /> 
          <br/>
          number: <input number={props.newNumber}
          onChange={props.handleNumberChange} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Notification = ({confirmationMessage, errorMessage}) => {
  const confirmationMessageStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    }
  
  const errorMessageStyle = {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }

  if (errorMessage === null && confirmationMessage === null) {
    return null
  }
  else if (errorMessage) {
    return (
      <div style={errorMessageStyle}>
        {errorMessage}
      </div>
    )
  }
  else if (confirmationMessage){
    return (
      <div style={confirmationMessageStyle}>
        {confirmationMessage}
      </div>
    )
  }
  
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
        .then(response => {
          setPersons(response)
        })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log(event.target)
    const personObject = {
      name: newName,
      number: newNumber,
    }
    setNewNumber('')
    setNewName('')

    const existingPerson = persons.find(person => person.name === personObject.name)
    if (existingPerson) {
      if (window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
        )){
            personService
            .update(existingPerson.id, {...existingPerson, number: newNumber})
            .then((returnedPerson) => {
              setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
              setConfirmationMessage(`Changed ${newName}'s number`)
              setTimeout(() => {
                setConfirmationMessage(null)
              },4000)
            })
            .catch(error => {
              setErrorMessage(`Information of ${newName} has already been removed from server`)
              setTimeout(() => {
              setErrorMessage(null)
              },4000)
              
            })
          return
        }
    }
    else {
      personService
      .create(personObject)
        .then(returnedName =>{
        setPersons(persons.concat(returnedName))
        setConfirmationMessage(`Added ${newName}`)
        setTimeout(() => {
          setConfirmationMessage(null)
        },4000)
      })
      .catch(error => {
        console.log(error.response.data)
        const errormessage = JSON.stringify(error.response.data)
        setErrorMessage(errormessage)
        setTimeout(() => {
        setErrorMessage(null)
        },4000)
      })
    }
  }

  const deletePerson = (person) =>{
    console.log('delete effect')
    if (window.confirm(`Delete ${person.name} ?`)){
      personService.deletePerson(person.id)
      .then(()=>{
        personService.getAll()
        .then(response => {
          setPersons(response)
          })
      })
      setConfirmationMessage(`Deleted ${person.name}`)
      setTimeout(() => {
        setConfirmationMessage(null)
        },4000)
      }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterNameChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value)
  }

  const showPersons = filterName === ''
    ? persons : persons.filter((person) => 
        person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <Notification 
      confirmationMessage={confirmationMessage} 
      errorMessage={errorMessage}
      />
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      <h2>Add a new</h2>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={showPersons}
        deleteperson={deletePerson}
      />
    </div>
  )

}

export default App
