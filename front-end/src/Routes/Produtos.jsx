import FormProduct from '../components/FormProduct/FormProduct'
import Carrinho from '../components/Carrinho/Carrinho'
import FormUser from '../components/FormUser/FormUser'

import './produtos.css'

const Produtos = () => {
  return (
    <div className='conteudoTotal'>
      <div className='contentProduct'>
        <FormProduct />
        <Carrinho />
      </div>
      <div>
        <FormUser />
      </div>
    </div>
  )
}

export default Produtos