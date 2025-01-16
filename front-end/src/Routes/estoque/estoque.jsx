import { useState, useEffect } from "react"
import axios from "axios"

import FilterProduct from "../../components/FilterProduct/FilterProduct.jsx"
import ProductEstoque from "../../components/ProductEstoque/ProductEstoque.jsx"

import './estoque.css'

const Estoque = () => {
    // * Pegando os produtos
    const [produtos, setProdutos] = useState([])

    const fetchProdutos = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/stock/get")
            setProdutos(responde.data)
        } catch (err) {
            console.error("Erro: ", err)
        }
    }

    useEffect(() => {
        fetchProdutos()
    }, [])

    return (
        <FilterProduct produtos={produtos} className="filter-produts" />
    )
}

export default Estoque
