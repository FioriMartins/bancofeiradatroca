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
    const [comandas, setComandas] = useState([])
    const [stateLoading, setStateLoading] = useState(false)
    const [idSearch, setIdSearch] = useState("")
    const [comandaName, setComandaName] = useState("")  
    const [comandaSelected, setComandaSelected] = useState()
    const [nameSearch, setNameSearch] = useState("")
    const [selectedValue, setSelectedValue] = useState();
    const [openError, setOpenError] = useState(false)
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false)

    useEffect(() => {
        const estado = localStorage.getItem("alerta")

        if (estado == 'true') {
            setOpenEdit(true)
            localStorage.setItem('alerta', 'false')
        } 
    }, [])

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
        setNameSearch(e.target.value.toUpperCase())
    }

    const handleClickOpen = (id, name) => {
        setComandaSelected(id)
        setComandaName(name)
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
        setOpenError(false)
        setOpenEdit(false)
    };

    const filteredComandas = () => {
        let searchStr = nameSearch; 
        let results = []; 
    
        while (searchStr.length > 0) {
            results = comandas.filter((comanda) =>
                comanda.id.includes(idSearch) || comanda.nome.toUpperCase().includes(searchStr.toUpperCase())
            );
    
            if (results.length > 0) break;
    
            searchStr = searchStr.slice(0, -1);
        }
    
        return results.map((comanda) => (
            <div
                className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'}
                key={comanda.id}
                onClick={() => {
                    if (comanda.ativo) {
                        handleClickOpen(comanda.id, comanda.nome);
                    } else {
                        setOpenError(true);
                    }
                }}
            >
                <p>{comanda.id} - {comanda.nome}</p>
            </div>
        ));
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
                {nameSearch || idSearch ? filteredComandas() : 
                comandas.map((comanda) => (
                    <div
                        className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'}
                        key={comanda.id}
                        onClick={() => {
                            if (comanda.ativo) {
                                handleClickOpen(comanda.id, comanda.nome);
                            } else {
                                setOpenError(true);
                            }
                        }}
                    >
                        <p>{comanda.id} - {comanda.nome}</p>
                    </div>
                ))}
                {open && <FormComandas backdropOpen={open} onClose={handleClose} selectedValue={selectedValue} edit={comandaSelected} name={comandaName}/>}
            </div>
            <Loading state={stateLoading} onClose={handleCloseLoading} />
            <Alerta state={openEdit} onClose={handleClose} text="Comanda editada com sucesso!" severity="info" />
            <Alerta state={openError} onClose={handleClose} text="Não é possivel selecionar a comanda!" severity="error" />
        </div>
    )
}