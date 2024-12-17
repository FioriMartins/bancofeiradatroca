import './FormUser.css'
import { useState, useEffect } from "react"
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../firebase/connect'

import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import AddCardIcon from '@mui/icons-material/AddCard'
import Autocomplete from "@mui/material/Autocomplete"
import FormComandas from '../FormComandas/FormComandas'

import Alerta from '../Alerta/Alerta'
import Loading from '../Loading/Loading'

export default function FormUser() {
    const [value, setValue] = useState(null)
    const [stateReadComanda, setStateReadComanda] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [comandas, setComandas] = useState([])
    const [carrinho, setCarrinho] = useState([])
    const [total, setTotal] = useState(0)

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlertError(false)
    }

    const readComandas = async () => {
        setStateLoading(true)
        try {
            if (!stateReadComanda) {
                const cArray = []
                const querySnapshot = await getDocs(collection(db, "comandas"))

                querySnapshot.forEach(async (doc) => {
                    if (doc.data().ativo) {
                        cArray.push({ id: doc.id, ...doc.data() })
                    }
                })
                setStateReadComanda(true)
                setComandas(cArray)
            }

            setStateLoading(false)
        } catch (err) {
            setStateLoading(false)
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
    }

    const [dados, setDados] = useState({
        id: "",
        nome: ""
    })

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (valor) => {
        setOpen(false);
    };

    useEffect(() => {
        const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || []

        const totalCalculado = carrinhoSalvo.reduce((acc, carro) => acc + Number(carro.valor), 0)
        setTotal(totalCalculado)

        setCarrinho(carrinhoSalvo)
    }, [])

    return (
        <div className="formUser">
            <h2>Formulario do usuário</h2>
            <p>Selecione ou cadastre uma comanda.</p>
            <div>
                <p>ETC$: {carrinho.length === 0 ? (" Não há nenhum item no carrinho.") : (total)}</p>
            </div>
            <form className="classUser">
                <Autocomplete
                    value={value}
                    id="free-solo-dialog-demo"
                    options={comandas}
                    getOptionLabel={(option) => {
                        if (typeof option === "string") {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.id;
                    }}
                    onChange={(event, newValue) => {
                        setDados({
                            ...dados,
                            id: newValue.id,
                        });
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <li key={key} {...optionProps}>
                                {option.id} - {option.nome}
                            </li>
                        );
                    }}
                    sx={{
                        width: 223,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#343c4c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#343c4c",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#343c4c",
                        },
                        "& .Mui-focused label": {
                            color: "#343c4c",
                        },
                    }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            name="comanda"
                            onChange={handleChange}
                            {...params}
                            label="Comanda"
                            onClick={readComandas}
                        />
                    )}
                    required
                />
                <IconButton onClick={handleClickOpen}>
                    <AddCardIcon />
                </IconButton>
            </form>
            <FormComandas
                edit={null}
                onClick={handleClickOpen}
                backdropOpen={open}
                onClose={handleClose}
            />
            <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar as comandas!" severity="error" />
            <Loading state={stateLoading} />
        </div>
    )
}