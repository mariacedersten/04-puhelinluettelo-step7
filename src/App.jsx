import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    Etsi: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      Nimi: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      Numero: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">Lisää</button>
    </div>
  </form>
)

const Persons = ({ persons }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>{person.name} {person.number}</li>
    ))}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) // Изначально пустой список
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Функции обработки изменений для формы
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Функция обработки отправки формы
  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} on jo lisätty puhelinluetteloon`)
      return
    }

    const person = { name: newName, number: newNumber }
    setPersons(persons.concat(person))
    setNewName('')
    setNewNumber('')
  }

  // Фильтрация списка по имени
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  // useEffect для получения данных с сервера
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data) // Обновление списка людей
      })
      .catch(error => {
        console.error('Error fetching data:', error) // Обработка ошибок
      })
  }, []) // Пустой массив зависимостей, чтобы запрос выполнялся только один раз

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Lisää uusi</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numerot</h3>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App