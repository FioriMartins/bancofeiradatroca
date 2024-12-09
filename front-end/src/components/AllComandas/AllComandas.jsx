import { useState, useEffect, useRef } from 'react'
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../firebase/connect'

import FormComandas from '../FormComandas/FormComandas'
import Loading from '../Loading/Loading'
import Alerta from '../Alerta/Alerta'

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";

import './AllComandas.css'

export default function AllComandasComponent() {
    const idRef = useRef(null)
    const [comandas, setComandas] = useState([])
    const [stateLoading, setStateLoading] = useState(false)
    const [idSearch, setIdSearch] = useState(0)
    const [comandaSelected, setComandaSelected] = useState()
    const [nameSearch, setNameSearch] = useState("")
    const [selectedValue, setSelectedValue] = useState();
    const [openError, setOpenError] = useState(false)
    const [open, setOpen] = useState(false);

    const readComandas = async () => {
        setStateLoading(true)
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                cArray.push({ id: doc.id, ...doc.data() })
            })

            setComandas(cArray)

            setStateLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas(true)
    }, [])

    const handleCloseLoading = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setStateLoading(false)
    };

    const handleChange = (e) => {
        setIdSearch(e.target.value)
        setNameSearch(e.target.value)
    }

    const handleClickOpen = (id) => {
        setComandaSelected(id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false)
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        
        setOpenError(false);
    };

    return (
        <div className="button-container">
            <div className='form-search'>
                <form>
                    <TextField
                        name="comanda"
                        label="Comanda"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={handleChange}
                    />
                </form>
            </div>
            <div className='comandas'>
                {comandas.map((comanda) => (
                    comanda.id.includes(idSearch) || comanda.nome.includes(nameSearch) ? (
                        <div 
                            className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'} 
                            key={comanda.id} 
                            onClick={() => {
                                if (comanda.ativo) {
                                    handleClickOpen(comanda.id)
                                } else {
                                    setOpenError(true)
                                }
                            }}
                        >
                            <p>{comanda.id} - {comanda.nome}</p>
                        </div>
                    ) : null
                ))}
                {open && <FormComandas backdropOpen={open} onClose={handleClose} selectedValue={selectedValue} edit={comandaSelected}/>}
            </div>
            <Loading state={stateLoading} onClose={handleCloseLoading} />
            <Alerta state={openError} onClose={handleCloseAlert} text="Não é possivel selecionar a comanda!" severity="error" />
        </div>
    )
}