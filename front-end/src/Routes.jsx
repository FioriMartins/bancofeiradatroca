import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Produtos from './Routes/produtos/produtos.jsx'
import Config from './Routes/config/config.jsx'
import Venda from './Routes/venda/venda.jsx'
import Comandas from './Routes/comandas/comandas.jsx'
import Caixas from './Routes/caixas/caixas.jsx'
import Graficos from './Routes/graficos/graficos.jsx'

import './Routes.css'
import SideBar from './components/SideBar/SideBar.jsx'

function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <SideBar />
                <div className='container'>
                    <Routes>
                        <Route path="/" element={<Produtos />} />
                        <Route path='/caixas' element={<Caixas />} />
                        <Route path='/graficos' element={<Graficos />} />
                        <Route path="/comandas" element={<Comandas />} />
                        <Route path="/config" element={<Config />} />
                        <Route path="/vender" element={<Venda />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes