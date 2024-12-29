import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Produtos from './Routes/produtos/produtos.jsx'
import Config from './Routes/config/config.jsx'
import Venda from './Routes/venda/venda.jsx'
import Comandas from './Routes/comandas/comandas.jsx'
import Estoque from './Routes/estoque/estoque.jsx'
import Graficos from './Routes/graficos/graficos.jsx'

import './Routes.css'
import SideBarFixed from './components/SideBarFixed/SideBarFixed.jsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'

function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <SideBarFixed />
                <div className='container'>
                    <Routes>
                        <Route path="/" element={<Produtos />} />
                        <Route path='/estoque' element={<Estoque />} />
                        <Route path='/graficos' element={<Graficos />} />
                        <Route path="/comandas" element={<Comandas />} />
                        <Route path="/config" element={<PrivateRoute element={<Config />} />} />
                        <Route path="/venda" element={<Venda />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes