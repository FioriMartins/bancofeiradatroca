export default function CriarCategoria() {
  return (
    <>
      <p>Criar Categoria</p>
      <form onSubmit={handleSubmit}>
        <input placeholder='turma' name='id' onChange={handleChange} required/>
        <input type='text' placeholder='patrono' name='patrono' onChange={handleChange}/>
        <input placeholder='descricao' name='descricao' onChange={handleChange}/>
        <button type='submit'>Enviar</button>
      </form>
    </>
  )
}
