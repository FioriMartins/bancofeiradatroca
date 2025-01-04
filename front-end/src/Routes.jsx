import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

import Produtos from './Routes/produtos/produtos.jsx'
import Config from './Routes/config/config.jsx'
import Venda from './Routes/venda/venda.jsx'
import Comandas from './Routes/comandas/comandas.jsx'
import Estoque from './Routes/estoque/estoque.jsx'
import Graficos from './Routes/graficos/graficos.jsx'

import './Routes.css'
import SideBarFixed from './components/SideBarFixed/SideBarFixed.jsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'

const tokenData = localStorage.getItem('token')

if (!tokenData || tokenData === " " || tokenData === "{}") {
    localStorage.setItem('token', JSON.stringify({ token: '', username: 'LogIn necessario', status: 401 }))
} 

function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <SideBarFixed />
                <div className='container'>
                    <Routes>
                        <Route path="/" element={<PrivateRoute element={<Produtos />} />} />
                        <Route path='/estoque' element={<PrivateRoute element={<Estoque />} />} />
                        <Route path='/graficos' element={<PrivateRoute element={<Graficos />} />} />
                        <Route path="/comandas" element={<PrivateRoute element={<Comandas />} />} />
                        <Route path="/config" element={<PrivateRoute element={<Config />} />} />
                        <Route path="/venda" element={<Venda />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes