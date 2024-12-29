import FormProduct from '../../components/FormProduct/FormProduct'
import Carrinho from '../../components/Carrinho/Carrinho'
import Transacoes from '../../components/Transacoes/Transacoes'

import './produtos.css'

const Produtos = () => {
  return (
    <div className='conteudoTotal'>
        <FormProduct />
        <Transacoes />
    </div>
  )
}

export default Produtos