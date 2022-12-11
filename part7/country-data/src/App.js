import { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const Countryinfo = ({ countryinfo }) => {
  console.log(countryinfo)

  return (
    <div>
      <h1>
        {countryinfo.countryname.map((country) => 
        country.name.common)}
      </h1>
      capital {countryinfo.countryname[0].capital} <br/>
      area {countryinfo.countryname[0].area} <br/>
      <h2>
        languages:
      </h2>
      <ul>
        {Object.entries(countryinfo.countryname[0].languages).map(([key, value]) =>(
          <li key={key}>
            {value}
          </li>
        ))}
      </ul>
      <img src={countryinfo.countryname[0].flags.png} alt="Flag"></img>
    </div>
  )
}

const Country = ({country}) => {

  if (!country) {
    return <div>no country found...</div>
  }


  return (
    <div>
      <h3>{country.name.common}</h3>
      <div>population {country.population}</div> 
      <div>capital {country.capital}</div>
      <img src={country.flags.png} height='100' alt={`flag of ${country.name.common}`}/> 
    </div>
  )  
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`).then(({ data }) => {
      setCountry(data[0])
    }).catch(() => {
      setCountry(null)
    })
  }, [name])

  return country
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
