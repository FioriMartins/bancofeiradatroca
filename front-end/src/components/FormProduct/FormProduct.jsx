import { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop'

import Loading from "../Loading/Loading"
import Alerta from "../Alerta/Alerta";

import "./FormProduct.css";

const FormProduct = () => {
    const filter = createFilterOptions()
    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [subCategorias, setSubCategorias] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [valueCategoria, setValueCategoria] = useState(null)


    // Não sei se ainda existe subcategoria nos dados, penso que só existe categoria
    const [dados, setDados] = useState({
        nome: "",
        valor: 0,
        categoria: "",
        subcategoria: ""
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlertError(false)
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
    }

    const handleSubmitCategoria = async (categoria) => {
        console.log(categoria)
        try {
            setDados({
                ...dados,
                categoria: categoria
            })

            await axios.post('http://localhost:3000/categorias/receive', {
                nome: categoria
            })
        } catch (err) {
            console.log(err)
        }
    };

    const fetchCategorias = async () => {
        setStateLoading(true)
        try {
            const responde = await axios.get("http://localhost:3000/categorias");
            setCategorias(responde.data);
            setStateLoading(false)
        } catch (err) {
            setStateLoading(false)
            setOpenAlertError(true)
            console.log("Erro: ", err)
        }
    };

    const fetchSubCategorias = async () => {
        setStateLoading(true)
        try {
            const responde = await axios.get(`http://localhost:3000/subcategorias`)
            setSubCategorias(responde.data.map((subcat) => {
                const categoria = categorias.find((cat) => cat.id === subcat.categoriaID)
                
                if (categoria) {
                    return {...subcat, categoriaNome: categoria.nome}
                }
            }))
        } catch (err) {
            setStateLoading(false)
            setOpenAlertError(true)
            console.log("Erro: ", err)
        } finally {
            setStateLoading(false)
        }
    }

    const adicionarAoCarrinho = (produto) => {
        let car = JSON.parse(localStorage.getItem("carrinho")) || [];

        car.push(produto);

        localStorage.setItem("carrinho", JSON.stringify(car));

        console.log("Produto adicionado:", produto);
    };

    const handleSubmitCarrinho = () => {
        adicionarAoCarrinho(dados)
    };

    const [open, setOpen] = useState(false);
    
    const handleCloseBackdrop = () => {
        setOpen(false);
    };
    
    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        fetchCategorias()
    }, [])

    useEffect( () => {
        fetchSubCategorias()
    }, [categorias])
    
    return (
        <div>
            <form className="formularioProdutos" onSubmit={handleSubmitCarrinho}>
                <h2>Formulário de Cadastro de Produtos</h2>
                <p>Tente preencher todas as entradas.</p>
                <TextField
                    name="nome"
                    onChange={handleChange}
                    id="outlined-basic"
                    label="Nome do produto"
                    variant="outlined"
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
                    onChange={handleChange}
                    type="number"
                    min="1"
                    label="Valor do produto"
                    variant="outlined"
                    value={dados.valor}
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

                <Autocomplete
                    onChange={(event, newValue) => {
                        if (event.target.innerText) {
                            setDados({
                            ...dados,
                            valor: newValue.valor,
                            categoria: newValue
                        })
                        } else {
                            setDados({
                                ...dados,
                                valor: 0
                            })
                        }
                        
                        if (typeof newValue === 'string') {
                            setValueCategoria(newValue);
                        } else if (newValue && newValue.inputValue) {
                            setValueCategoria(newValue.inputValue);
                            handleSubmitCategoria(newValue.inputValue)
                        } else {
                            setValueCategoria(newValue);
                        }
                    }}
                    value={valueCategoria}
                    sx={{
                        width: 223,
                        backgroundColor: "white",
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
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={subCategorias}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const { inputValue } = params;
                        const trimInput = inputValue.trim().toLowerCase();

                        const isExisting = options.some((option) => trimInput === option.nome.toLowerCase());
                        if (trimInput !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                nome: `Adicionar "${inputValue}"?`,
                            });
                        }
                    
                        return filtered;
                    }}
                    groupBy={(option) => option.categoriaNome}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return (option);
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return (option.inputValue);
                        }
                        // Regular option
                        return (option.nome);
                    }}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <li key={key} {...optionProps} className="li-option-icon">
                                <div>{option.nome}</div>
                                <IconButton onClick={handleOpen}><EditIcon /></IconButton>
                            </li>
                        );
                    }}
                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} name="categoria" onChange={handleChange} onClick={fetchSubCategorias} label="Categoria" required />
                    )}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            handleSubmitCategoria(event.target.value)
                        }
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<AddShoppingCartIcon />}
                    sx={{ backgroundColor: "#343c4c", color: "#e8f7f2" }}
                >
                    Adicionar
                </Button>
            </form>

            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                open={open}
                onClick={handleCloseBackdrop}
            >
                <div>
                    <h1>Editar categoria</h1>
                    <p>Preencha tudo cadela</p>
                    <TextField></TextField>
                </div>
            </Backdrop>

            <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar o banco de dados" severity="error" />
            <Loading state={stateLoading} />
        </div>
    );
};

export default FormProduct;
