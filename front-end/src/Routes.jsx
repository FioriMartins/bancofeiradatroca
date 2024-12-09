import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Produtos from './Routes/produtos.jsx'
import Config from './Routes/config.jsx'
import Venda from './Routes/venda.jsx'
import Comandas from './Routes/comandas.jsx'

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