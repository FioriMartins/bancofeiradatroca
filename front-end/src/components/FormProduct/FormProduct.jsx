import { useState, useEffect } from "react";
import axios from "axios";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from '@mui/icons-material/Edit';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button"
import SendRoundedIcon from '@mui/icons-material/SendRounded'

import Loading from "../Loading/Loading"
import Alerta from "../Alerta/Alerta"
import FormUser from "../FormUser/FormUser"
import Carrinho from '../../components/Carrinho/Carrinho'
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
    const [openFormUser, setOpenFormUser] = useState(false)

    // ! excluir dps
    const [valueNome, setValueNome] = useState({})

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
        e.preventDefault()
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
    }

    const handleChangeValueName = (event, newValue) => {
        if (event.target.innerText) {
            setDados({
                ...dados,
                valor: newValue.valor,
                categoria: newValue
            })
        }

        const { name, value } = event.target

        if (typeof newValue === 'string') {
            setValueCategoria({
                ...valueCategoria,
                [name]: value,
                categoriaNome: newValue.nome,
                categoriaID: newValue.id
            })
            setValueNome({ [name]: value })
        } else if (newValue && newValue.inputValue) {
            setValueCategoria(newValue.inputValue)
            handleOpenAddCategory(true)
        } else {
            setValueCategoria(newValue || {
                ...valueCategoria,
                [name]: value
            })
        }
    }

    const fetchCategorias = async () => {
        setStateLoading(true)
        try {
            const responde = await axios.get("http://localhost:3000/categorias");
            setCategorias(responde.data);
            setStateLoading(false)
            fetchSubCategorias()
        } catch (err) {
            setStateLoading(false)
            setOpenAlertError(true)
            console.log("Erro: ", err)
        }
    };

    const fetchSubCategorias = async () => {
        try {
            const responde = await axios.get(`http://localhost:3000/subcategorias`);
            const subCategoriasMapeadas = responde.data.map((subcat) => {
                const categoria = categorias.find((cat) => cat.id === subcat.categoriaID);
                if (categoria) {
                    return { ...subcat, categoriaNome: categoria.nome }
                }
                return null
            }).filter(Boolean)

            const subCategoriasOrdenadas = subCategoriasMapeadas.sort((a, b) =>
                a.categoriaNome.localeCompare(b.categoriaNome)
            )

            setSubCategorias(subCategoriasOrdenadas)
        } catch (err) {
            setOpenAlertError(true)
            console.log("Erro: ", err)
        } finally {
            setStateLoading(false)
        }
    }

    const adicionarAoCarrinho = (produto) => {
        let car = JSON.parse(localStorage.getItem("carrinho")) || []

        car.push(produto)

        localStorage.setItem("carrinho", JSON.stringify(car))

        console.log("Produto adicionado:", produto)
    }

    const handleSubmitCarrinho = () => {
        adicionarAoCarrinho(dados)
    }

    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    const handleCloseBackdrop = () => {
        setOpen(false)
        setOpenAdd(false)
    }

    const handleOpen = (nome, valor, categoria) => {
        setDados({
            nome,
            valor,
            categoria,
        })
        setOpen(true)
    }

    const handleOpenAddCategory = () => {
        setOpenAdd(true);
    };

    useEffect(() => {
        fetchCategorias()
    }, [])

    return (
        <>
            <div className="allContentFormProduct">
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
                                onChange={handleChangeValueName}
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
                                    <TextField {...params} name="categoria" onChange={handleChange} onFocus={() => !subCategorias.length && fetchSubCategorias()} label="Subcategoria" required />
                                )}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        return
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
                            <Button
                                onClick={() => setOpenFormUser(true)}
                                variant="contained"
                                endIcon={<SendRoundedIcon />}
                                id='buttonEnviar'
                            >
                                Finalizar troca
                            </Button>
                        </div>
                    </form>
                    {open && <EditarCategoria subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setOpen={setOpen} setDados={setDados} dados={dados} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} handleChangeValueName={handleChangeValueName} />}
                    {openAdd && <AdicionarCategoria subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={openAdd} setDados={setDados} dados={dados} setOpenAdd={setOpenAdd} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} />}
                    <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar o banco de dados" severity="error" />
                    <Loading state={stateLoading} />
                </div>
                <Carrinho />
            </div>
            <FormUser openFormUser={openFormUser} setOpenFormUser={setOpenFormUser}/>
        </>
    );
};

export default FormProduct;