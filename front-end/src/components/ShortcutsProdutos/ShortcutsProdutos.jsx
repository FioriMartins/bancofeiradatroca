import {useState} from 'react'

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SellIcon from '@mui/icons-material/Sell';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';

import ProductsPrice from '../ProductsPrice/ProductsPrice';
import Timeline from '../Timeline/Timeline';
import Chat from '../Chat/Chat'

import './ShortcutsProdutos.css'

const ShortcutsProdutos = () => {
    // * Botão de abrir Backdrop (Preços)
    const [openPrice, setOpenPrice] = useState(false)

    const handleOpenPrice = () => {
        setOpenPrice(true)
    }

    const handleClosePrice = () => {
        setOpenPrice(false)
    }

    // * Botão de abrir Backdrop (Horários)
    const [openTimeline, setOpenTimeline] = useState(false)

    const handleOpeTimeline = () => {
        setOpenTimeline(true)
    }

    const handleCloseTimeline = () => {
        setOpenTimeline(false)
    }

    // * Botão de abrir barra lateral (NavBar)
    const [openChatNav, setOpenChatNav] = useState(false);

    const handleOpenChatNav = () => {
        setOpenChatNav(true);
    };

    const handleCloseChatNav = () => {
        setOpenChatNav(false);
    };

    return (
        <div className='shortcuts-container'>
            <div className='shortcuts'>
                <Tooltip title="Preços">
                    <IconButton variant="contained" onClick={handleOpenPrice}>
                        <SellIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Horários">
                    <IconButton variant="contained" onClick={handleOpeTimeline}>
                        <AccessTimeIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Chat">
                    <IconButton variant="contained" onClick={handleOpenChatNav}>
                        <ChatIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {/* // * Talvez chat aqui */}

            {openPrice && <ProductsPrice openPrice={openPrice} handleClosePrice={handleClosePrice} />}
            {openTimeline && <Timeline openTimeline={openTimeline} handleCloseTimeline={handleCloseTimeline} />}
            {openChatNav && <Chat openChatNav={openChatNav} handleCloseChatNav={handleCloseChatNav} />}
        </div>
    )
}

export default ShortcutsProdutos
