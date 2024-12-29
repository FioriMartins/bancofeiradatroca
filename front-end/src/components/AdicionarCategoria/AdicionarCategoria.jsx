import axios from 'axios'
import { useState } from 'react'

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import Backdrop from '@mui/material/Backdrop'
import Alerta from "../Alerta/Alerta"
import FormDeleteCategoria from "../FormDeleteCategoria/FormDeleteCategoria"

import "./AdicionarCategoria.css";

export default function AdicionarCategoria({ open, setOpenAdd, fetchCategorias, fetchSubCategorias, handleCloseBackdrop, valueCategoria, setValueCategoria, categorias, setDados, dados, subCategorias }) {
    const [openAlert, setOpenAlert] = useState(false)
    const [openAlertSubcategoria, setOpenAlertSubcategoria] = useState(false)
    const [openAlertAdd, setOpenAlertAdd] = useState(false)
    const [openAlertExists, setOpenAlertExists] = useState(false)
    const [openOptions, setOpenOptions] = useState(false)
    const [categoriaID, setCategoriaID] = useState()

    const filter = createFilterOptions()

    const handleSubmit = async () => {
        let exists = false

        subCategorias.forEach(element => {
            if (element.nome.toUpperCase() === valueCategoria.nome.toUpperCase()) {
                setOpenAlertExists(true)
                exists = true
            }
        })

        if (exists === false) {
            try {
                await axios.post('http://localhost:3000/subcategorias/receive', {
                    nome: valueCategoria.nome,
                    valor: valueCategoria.valor,
                    categoriaID: valueCategoria.categoriaID
                })
                setOpenAlertSubcategoria(true)
            } catch (err) {
                console.log(err)
            }
        }
    }
    const handleAddCategoria = async (nomeCategoria) => {
        try {
            const response = await axios.post('http://localhost:3000/categorias/receive', {
                nome: nomeCategoria
            });

            const novaCategoria = response.data; // * Supondo que o backend retorna a categoria criada com o ID
            setValueCategoria({
                ...valueCategoria,
                categoriaNome: novaCategoria.nome,
                categoriaID: novaCategoria.id // * Atualiza com o ID retornado
            });

            setOpenAlertAdd(true);
        } catch (err) {
            console.log(err);
        } finally {
            await fetchCategorias();
            await fetchSubCategorias();
        }
    };

    // ! não está sendo usado
    const handleChange = (event, newValue) => {
        const { name, value } = event.target

        if (typeof newValue === 'string') {
            setValueCategoria({
                ...valueCategoria,
                categoriaNome: newValue.nome,
                categoriaID: newValue.id
            })
            console.log(newValue)
        } else if (newValue && newValue.inputValue) {
            setValueCategoria(newValue.inputValue)
            handleAddCategoria(newValue.inputValue)
        } else {
            console.log(valueCategoria)
        }
    }

    const handleOpenBackdropButton = (option) => {
        setOpenOptions(true)
        setCategoriaID(option)
    }

    const handleCloseBackdropButton = () => {
        if (openAlertSubcategoria === true) {
            setOpenAlertSubcategoria(false)
            setOpenAdd(false)
        }

        setOpenOptions(false)
        setOpenAlert(false)
        setOpenAlertAdd(false)
        setOpenAlertExists(false)
    }

    const handleDeleteCategoria = async (id) => {
        if (openOptions) {
            try {
                const response = await axios.delete(`http://localhost:3000/categorias/${id}`)
                console.log('Resposta do servidor: ', response.data)
                setOpenOptions(false)
                setOpenAlert(true)
                fetchCategorias()
            } catch (err) {
                setOpenOptions(false)
                console.error(err)

                if (err.response.data.original.errno === 1451) {
                    alert("Voce nao pode apagar porque tem subcategorias dentro desta categoria")
                }
            }
        }
    }

    return (
        <>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={open}
                onClick={handleCloseBackdrop}
            >
                <form onSubmit={handleSubmit}>
                    <div onClick={(e) => e.stopPropagation()}
                        style={{ background: `#f5f5f5`, color: `#343c4c`, width: `30dvw`, borderRadius: `10px`, paddingLeft: `1.5rem`, paddingBottom: `1.5rem` }}>
                        <h1>Adicionar subcategoria</h1>
                        <Autocomplete
                            onChange={(event, newValue) => {
                                if (newValue && newValue.inputValue) {
                                    handleAddCategoria(newValue.inputValue)
                                } else {
                                    setValueCategoria({
                                        ...valueCategoria,
                                        categoriaNome: newValue.nome,
                                        categoriaID: newValue.id
                                    })
                                }
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#28292b",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#28292b",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#28292b",
                                },
                                "& .Mui-focused label": {
                                    color: "#28292b",
                                },
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="free-solo-with-text-demo"
                            options={categorias}
                            value={valueCategoria.categoriaNome}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const trimInput = inputValue.trim().toLowerCase();

                                const isExisting = options.some((option) => trimInput === option?.nome.toLowerCase());
                                if (trimInput !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        nome: `Adicionar categoria "${inputValue}"?`,
                                    });
                                }

                                return filtered;
                            }}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return (option);
                                }
                                if (option.inputValue) {
                                    return (option.inputValue);
                                }
                                return (option.nome);
                            }}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={key} {...optionProps} className="li-option-icon">
                                        <div>{option.nome}</div>
                                        {option.nome.includes("?") || <IconButton onClick={() => handleOpenBackdropButton(option.id)}>
                                            <DeleteForeverIcon />
                                        </IconButton>}
                                    </li>
                                );
                            }}
                            freeSolo
                            renderInput={(params) => (
                                <TextField {...params} name="categoriaNome" label="Categoria" variant="standard" required />
                            )}
                        />
                        <TextField
                            id="outlined-basic"
                            name="nome"
                            onChange={(event) => {
                                setValueCategoria({
                                    ...valueCategoria,
                                    nome: event.target.value
                                })
                            }}
                            type="string"
                            label="Subcategoria"
                            variant="standard"
                            value={valueCategoria.nome}
                            sx={{
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
                            required
                        />
                        <TextField
                            id="outlined-basic"
                            name="valor"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">ETC$</InputAdornment>
                                    ),
                                },
                            }}
                            onChange={(event) => {
                                setValueCategoria({
                                    ...valueCategoria,
                                    valor: event.target.value
                                })
                            }}
                            type="number"
                            min="1"
                            label="Valor do produto"
                            variant="standard"
                            value={valueCategoria.valor}
                            sx={{
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
                            required
                        />
                        <div className="form-buttons">
                            <Button type='submit'>
                                Enviar
                            </Button>
                            <Button onClick={handleCloseBackdrop}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </form>
                <div onClick={(e) => e.stopPropagation()} >
                    <Alerta state={openAlert} onClose={handleCloseBackdropButton} text="Categoria excluida com sucesso!" severity="warning" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertAdd} onClose={handleCloseBackdropButton} text="Categoria adicionada com sucesso!" severity="success" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertSubcategoria} onClose={handleCloseBackdropButton} text="Subategoria editada com sucesso!" severity="success" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertExists} onClose={handleCloseBackdropButton} text="Subcategoria já registrada com esse nome!" severity="error" />
                </div>
            </Backdrop>
            <FormDeleteCategoria openOptions={openOptions} handleCloseBackdropButton={handleCloseBackdropButton} handleDeleteCategoria={handleDeleteCategoria} />
        </>
    )
}