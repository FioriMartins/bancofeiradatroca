import { useState, useEffect } from "react"
import axios from "axios"

import FilterProduct from "../../components/FilterProduct/FilterProduct.jsx"
import ProductEstoque from "../../components/ProductEstoque/ProductEstoque.jsx"

import './estoque.css'

const Estoque = () => {
  const [produtos, setProdutos] = useState()

  const fetchProdutos = async () => {
    try {
      const responde = await axios.get("http://localhost:3000/stock/get")
      setProdutos(responde.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return (
    <div className="container-estoque">
      <FilterProduct produtos={produtos} className="filter-produts" />
      <ProductEstoque produtos={produtos} className="products-estoque" />
    </div>
  )
}

export default Estoque
