import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading({state}) {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
            open={state}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}