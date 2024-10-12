import { React, useState } from 'react'
import './App.css'

function App() {
  const [formDados, setFormDados] = useState({
    nome: '',
    precodef: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target 
    setFormDados({
      ...formDados,
      [name]: value,
    })
    console.log(formDados)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://#/categoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDados)
      })

      if (response.ok) {
        alert('Categoria registrada com sucesso!')
      }
    } catch (e) {
      alert('deu erro')
      console.error('Erro ao enviar os dados: ', e)
    }
  }

  return (
    <>
      <h1>Feira da Troca</h1>   
      <form onSubmit={handleSubmit}>
        <input type='text' onChange={handleChange} name="nome" />
        <input type='number' onChange={handleChange} name='precodef'/>
        <button type='submit'>Enviar</button>
      </form>
    </>
  )
}

export default App
