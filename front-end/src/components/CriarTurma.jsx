import { React, useState } from 'react'

export default function CriarTurma() {
  const [formDados, setFormDados] = useState({
    id: '',
    patrono: '',
    descricao: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormDados({
      ...formDados,
      [name]: value,
    })
    console.log(formDados.turma)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formDados)
    try {
      const response = await fetch('##', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDados),
      })

      if (response.ok) {
        alert('deu tudo certo!')
      } else {
        alert('deu errado!')
        console.log(response)
      }
    } catch (e) {
      console.error(e)
      alert(e)
    }
  }

  return (
    <>
      <p>Criar Turma</p>
      <form onSubmit={handleSubmit}>
        <input placeholder='turma' name='id' onChange={handleChange} required/>
        <input type='text' placeholder='patrono' name='patrono' onChange={handleChange}/>
        <input placeholder='descricao' name='descricao' onChange={handleChange}/>
        <button type='submit'>Enviar</button>
      </form>
    </>
  )
}