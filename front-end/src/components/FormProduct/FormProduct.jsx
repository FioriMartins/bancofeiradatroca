import { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";

import Loading from "../Loading/Loading"
import Alerta from "../Alerta/Alerta"
import FormUser from "../FormUser/FormUser"
import EditarCategoria from "../EditarCategoria/EditarCategoria.jsx"
import AdicionarCategoria from "../AdicionarCategoria/AdicionarCategoria.jsx";

import "./FormProduct.css";

const FormProduct = () => {
    const filter = createFilterOptions()

    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [subCategorias, setSubCategorias] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [valueCategoria, setValueCategoria] = useState({})

    const [dados, setDados] = useState({
        nome: "",
        valor: 0,
        categoria: ""
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

    const handleChangeValue = (event, newValue) => {
        if (event.target.innerText) {
            setDados({
                ...dados,
                valor: newValue.valor,
                categoria: newValue
            })
        }

        if (typeof newValue === 'string') {
            setValueCategoria(newValue)
        } else if (newValue && newValue.inputValue) {
            setValueCategoria(newValue.inputValue)
            handleOpenAddCategory(true)
        } else {
            setValueCategoria(newValue || " ")
        }
    }

    const handleSubmitCategoria = async (categoria) => {
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
                    return { ...subcat, categoriaNome: categoria.nome }
                }
            }))
            setStateLoading(false)
        } catch (err) {
            setStateLoading(false)
            setOpenAlertError(true)
            console.log("Erro: ", err)
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
    const [openAdd, setOpenAdd] = useState(false);

    const handleCloseBackdrop = () => {
        setOpen(false);
        setOpenAdd(false);
    };

    const handleOpen = (nome, valor, categoria) => {
        setDados({
            nome,
            valor,
            categoria,
        })
        setOpen(true);
    };

    const handleOpenAddCategory = (nome, valor, categoria) => {
        setDados({
            nome,
            valor,
            categoria,
        })
        setOpenAdd(true);
    };

    useEffect(() => {
        fetchCategorias()
    }, [])

    useEffect(() => {
        fetchSubCategorias()
    }, [categorias])

    return (
        <div className="allContent">
            <form className="formularioProdutos" onSubmit={handleSubmitCarrinho}>
                <h2>Cadastro de Produtos</h2>
                <p>É necessário preencher tudo.</p>
                <div className="divInputs">
                    <TextField
                        name="nome"
                        onChange={handleChange}
                        id="outlined-basic"
                        label="Nome do produto"
                        variant="outlined"
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
                        required
                    />
                    <Autocomplete
                        onChange={handleChangeValue}
                        sx={(theme) => ({
                            zIndex: theme.zIndex.drawer - 1199,
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
                        })}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={subCategorias}
                        value={valueCategoria.nome}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const trimInput = inputValue.trim().toLowerCase();

                            const isExisting = options.some((option) => trimInput === option?.nome.toLowerCase());
                            if (trimInput !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    nome: `Adicionar uma nova subcategoria "${inputValue}"?`,
                                });
                            }

                            return filtered;
                        }}
                        groupBy={(option) => option?.categoriaNome}
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
                                    {option.nome.includes("?") ||
                                        <IconButton onClick={() => {
                                            handleOpen(option.nome, option.valor, option.categoriaNome)
                                            setValueCategoria(option)
                                        }}>
                                            <EditIcon />
                                        </IconButton>}
                                </li>
                            );
                        }}
                        renderGroup={(params) => (
                            <div key={params.key} className="group-options">
                                <h3>{params.group}</h3>
                                {params.children}
                            </div>
                        )}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} name="categoria" onChange={handleChange} onClick={fetchSubCategorias} label="Subcategoria" required />
                        )}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                handleSubmitCategoria(event.target.value)
                            }
                        }}
                    />
                    <div className="sendValor">
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
                            value={valueCategoria.valor}
                            sx={{
                                width: '300px',
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
                            required
                        />
                        <Tooltip title="Adicionar produto no carrinho">
                            <IconButton type="submit" size="large"><AddShoppingCartIcon fontSize="inherit" color="success" /></IconButton>
                        </Tooltip>
                    </div>
                </div>
            </form>
            <FormUser />
            {open && <EditarCategoria fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setDados={setDados} dados={dados} setOpen={setOpen} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} />}
            {openAdd && <AdicionarCategoria fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={openAdd} setDados={setDados} dados={dados} setOpen={setOpen} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} />}
            <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar o banco de dados" severity="error" />
            <Loading state={stateLoading} />
        </div>
    );
};

export default FormProduct;
