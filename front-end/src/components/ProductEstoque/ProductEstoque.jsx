import "./ProductEstoque.css"

const ProductEstoque = ({produtos}) => {
  return (
    <div>
        {Array.isArray(produtos) && produtos.map((produto) => (
            <p key={produto.id}>Nome: {produto.nome}, SubCatID: {produto.subcategoriaID}, CaixaID: {produto.caixaID}, Status: {produto.estoqueStatus}, Valor: {produto.valor}</p>
        ))}
    </div>
  )
}

export default ProductEstoque
