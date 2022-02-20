import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = (props) => {
  return (
    <div>
      find coutries <input filtername={props.filterName} 
      onChange={props.handleFilterNameChange} />
    </div>
  )
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

const Countryname = (props) => {

  let list = props.countryname.map((country) =>
  country.name.common
  );
  console.log(list)


  if (list.length > 10 || list.length === 0){
    return (
      <div>Too many matches, specify another filter</div>
    );
  }
  
  if (list.length === 1){
    return(
      <Countryinfo countryinfo={props} />
    );
  }

  return(  
      <div>
        <ul>
          {props.countryname.map((country => (
            <li key={country.name.common}>
              {country.name.common} {" "}
              <button onClick={console.log("test")}>show</button>
            </li>
          )))
          } 
        </ul>
      </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [filterName, setFilterName] = useState('')
  
  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log(response.data)
        setCountries(response.data)
      })
  }, [])
  
  const handleFilterNameChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value)
  }

  const filterCountries = filterName === ''
    ? [] : countries.filter((country) => 
    country.name.common.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      <Countryname countryname={filterCountries}/>
    </div>
  )
}

export default App
