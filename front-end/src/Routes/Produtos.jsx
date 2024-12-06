import FormProduct from '../components/FormProduct/FormProduct'
import Carrinho from '../components/Carrinho/Carrinho'

const Produtos = () => {
  return (
    <div className='contentProduct'>
      <FormProduct />
      <div className='carrinho'>
        <h2>Carrinho</h2>
        <Carrinho />
      </div>
    </div>
  )
}

export default Produtos