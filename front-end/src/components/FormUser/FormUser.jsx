import './FormUser.css'
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../firebase/connect'

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton"
import AddCardIcon from '@mui/icons-material/AddCard';
import Autocomplete from "@mui/material/Autocomplete";
import Backdrop from '@mui/material/Backdrop';
import FormComandas from '../FormComandas/FormComandas'

export default function FormUser() {
    const [value, setValue] = useState(null)
    const [openCard, setOpenCard] = useState(false)
    const [comandas, setComandas] = useState([])

    const readComandas = async () => {
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                if (doc.data().ativo) {
                    cArray.push({ id: doc.id, ...doc.data() })
                }
            })

            setComandas(cArray)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
        console.log(dados)
    }

    const [dados, setDados] = useState({
        id: "",
        nome: ""
    })

    const [dialogValue, setDialogValue] = useState({
        id: "",
        nome: "",
    });

    const handleClose = () => {
        if (reason === 'clickaway') {
            return
        }
        setOpenCard(false);
    };

    const handleSubmit = async (event) => {
        // event.preventDefault();
        // setValue({
        //     nome: dialogValue.nome,
        //     desc: dialogValue.desc,
        // });
        console.log("teste")
        handleClose();
    };

    return (
        <div className="formUser">
            <form>
                <h2>Formulario do usuario</h2>
                <p>Por favor preencha tudo safada</p>

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
                        />
                    )}
                    required
                />
                <IconButton onClick={() => {
                    setOpenCard(true)
                }}><AddCardIcon /></IconButton>
            </form>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                open={openCard}
                onClose={handleClose}
            >
                <FormComandas />
            </Backdrop>
        </div>
    )
}