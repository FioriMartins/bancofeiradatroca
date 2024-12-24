import { useState, useEffect } from "react"
import axios from "axios"

const Estoque = () => {
  const [produtos, setProdutos] = useState()

  const fetchProdutos = async () => {
    try {
      const responde = await axios.get("http://localhost:3000/produtos")
      setProdutos(responde.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div>
      <div className="box">
        {Array.isArray(produtos) && produtos.map((produto) => (
          <p key={produto.id}>Nome: {produto.nome}, SubCatID: {produto.subcategoriaID}, CaixaID: {produto.caixaID}, Status: {produto.estoqueStatus}, Valor: {produto.valor}</p>
        ))}
      </div>
    </div>
  )
}

export default Estoque
