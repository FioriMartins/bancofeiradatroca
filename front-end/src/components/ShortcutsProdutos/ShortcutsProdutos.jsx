import IconButton from '@mui/material/IconButton';

import SellIcon from '@mui/icons-material/Sell';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';

import './ShortcutsProdutos.css'

const ShortcutsProdutos = () => {
  return (
    <div className='shortcuts-container'>
        <div className='shortcuts'>
            <IconButton variant="contained">
                {/* // * Tabela de preços */}
                <SellIcon />
            </IconButton>
            <IconButton variant="contained">
                {/* // * Horário */}
                <AccessTimeIcon />
            </IconButton>
            <IconButton variant="contained">
                {/* // * Chat */}
                <ChatIcon />
            </IconButton>
        </div>

        {/* // * Talvez chat aqui */}
    </div>
  )
}

export default ShortcutsProdutos
