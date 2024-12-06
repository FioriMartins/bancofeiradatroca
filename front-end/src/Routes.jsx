import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Produtos from './Routes/Produtos.jsx'
import Config from './Routes/Config.jsx'
import Venda from './Routes/Venda.jsx'
import Comandas from './Routes/Comandas.jsx'
import AllComandas from './Routes/AllComandas.jsx'

import './App.css'
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
                        <Route path="/comandas/todos" element={<AllComandas />} />
                        <Route path="/config" element={<Config />} />
                        <Route path="/vender" element={<Venda />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes