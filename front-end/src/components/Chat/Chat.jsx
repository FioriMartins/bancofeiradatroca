import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import './Chat.css';

const ShortcutsProdutos = ({openChatNav, handleCloseChatNav}) => {
    return (
        <div>
            <Drawer
                variant="persistent"
                anchor="right"
                open={openChatNav}
                onClose={handleCloseChatNav}
                sx={{
                    width: 350,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 350,
                        backgroundColor: '#f4f4f4',
                        padding: '1rem',
                    },
                }}
            >
                <div className="left-icon">
                    <IconButton variant="contained" onClick={handleCloseChatNav}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
                <Divider />
            </Drawer>
        </div>
    );
};

export default ShortcutsProdutos;
