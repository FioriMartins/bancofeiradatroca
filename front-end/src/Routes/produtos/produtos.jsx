import FormProduct from '../../components/FormProduct/FormProduct'
import Transacoes from '../../components/Transacoes/Transacoes'
import ShortcutsProdutos from '../../components/ShortcutsProdutos/ShortcutsProdutos'

import './produtos.css'

const Produtos = () => {
  return (
    <div className='conteudoTotal'>
      <FormProduct />
      <div className='right-container-produtos'>
        <Transacoes />
        <ShortcutsProdutos />
      </div>
    </div>
  )
}

export default Produtos