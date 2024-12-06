import { React, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import Home from './Routes/Home.jsx'
import Config from './Routes/Config.jsx'
import Venda from './Routes/Venda.jsx'
import Comandas from './Routes/Comandas.jsx'
import AllComandas from './Routes/AllComandas.jsx'

import './App.css'
import SideBar from './components/SideBar.jsx'


function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <SideBar />
                <div className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/comandas" element={<Comandas />}/>
                        <Route path="/comandas/todos" element={<AllComandas />}/>
                        <Route path="/config" element={<Config />} />
                        <Route path="/vender" element={<Venda />}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes