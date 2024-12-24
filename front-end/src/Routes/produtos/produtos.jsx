import FormProduct from '../../components/FormProduct/FormProduct'
import Carrinho from '../../components/Carrinho/Carrinho'

import './produtos.css'

const Produtos = () => {
  return (
    <div className='conteudoTotal'>
        <FormProduct />
        <Carrinho />
    </div>
  )
}

export default Produtos