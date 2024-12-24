import { useState } from 'react'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Alerta({state, onClose, text, severity}) {
    return (
        <Snackbar open={state} autoHideDuration={2000} onClose={onClose} sx={(theme) => ({ zIndex: theme.zIndex.drawer + 9999 })}  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ zIndex: 9999, width: '100%' }}
            >
                {text}
            </Alert>
        </Snackbar>
    )
}