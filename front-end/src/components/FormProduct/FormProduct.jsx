// import { useState, useEffect } from "react";
// import axios from "axios";

// import TextField from "@mui/material/TextField";
// import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import EditIcon from '@mui/icons-material/Edit';
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from '@mui/material/IconButton';
// import Tooltip from "@mui/material/Tooltip";
// import Button from "@mui/material/Button"
// import SendRoundedIcon from '@mui/icons-material/SendRounded'

// import Loading from "../Loading/Loading"
// import Alerta from "../Alerta/Alerta"
// import FormUser from "../FormUser/FormUser"
// import Carrinho from '../../components/Carrinho/Carrinho'
// import EditarCategoria from "../EditarCategoria/EditarCategoria.jsx"
// import AdicionarCategoria from "../AdicionarCategoria/AdicionarCategoria.jsx";

// import "./FormProduct.css";

// const FormProduct = () => {
//     const filter = createFilterOptions()

//     const [stateLoading, setStateLoading] = useState(false)
//     const [openAlertError, setOpenAlertError] = useState(false)
//     const [subCategorias, setSubCategorias] = useState([]);
//     const [categorias, setCategorias] = useState([]);
//     const [valueCategoria, setValueCategoria] = useState({})
//     const [openFormUser, setOpenFormUser] = useState(false)

//     excluir dps
//     const [valueNome, setValueNome] = useState({})

//     const [dados, setDados] = useState({
//         nome: "",
//         valor: 0,
//         categoria: ""
//     });

//     const handleClose = (event, reason) => {
//         if (reason === 'clickaway') {
//             return
//         }

//         setOpenAlertError(false)
//     };

//     const handleChange = (e) => {
//         e.preventDefault()
//         const { name, value } = e.target
//         setDados({
//             ...dados,
//             [name]: value,
//         })
//     }

//     const handleChangeValueName = (event, newValue) => {
//         if (event.target.innerText) {
//             setDados({
//                 ...dados,
//                 valor: newValue.valor,
//                 categoria: newValue
//             })
//         }

//         const { name, value } = event.target

//         if (typeof newValue === 'string') {
//             setValueCategoria({
//                 ...valueCategoria,
//                 [name]: value,
//                 categoriaNome: newValue.nome,
//                 categoriaID: newValue.id
//             })
//             setValueNome({ [name]: value })
//         } else if (newValue && newValue.inputValue) {
//             setValueCategoria(newValue.inputValue)
//             handleOpenAddCategory(true)
//         } else {
//             setValueCategoria(newValue || {
//                 ...valueCategoria,
//                 [name]: value
//             })
//         }
//     }

//     const fetchCategorias = async () => {
//         setStateLoading(true)
//         try {
//             const responde = await axios.get("http://localhost:3000/categorias");
//             setCategorias(responde.data);
//             setStateLoading(false)
//             fetchSubCategorias()
//         } catch (err) {
//             setStateLoading(false)
//             setOpenAlertError(true)
//             console.log("Erro: ", err)
//         }
//     };

//     const fetchSubCategorias = async () => {
//         try {
//             const responde = await axios.get(`http://localhost:3000/subcategorias`);
//             const subCategoriasMapeadas = responde.data.map((subcat) => {
//                 const categoria = categorias.find((cat) => cat.id === subcat.categoriaID);
//                 if (categoria) {
//                     return { ...subcat, categoriaNome: categoria.nome }
//                 }
//                 return null
//             }).filter(Boolean)

//             const subCategoriasOrdenadas = subCategoriasMapeadas.sort((a, b) =>
//                 a.categoriaNome.localeCompare(b.categoriaNome)
//             )

//             setSubCategorias(subCategoriasOrdenadas)
//         } catch (err) {
//             setOpenAlertError(true)
//             console.log("Erro: ", err)
//         } finally {
//             setStateLoading(false)
//         }
//     }

//     const adicionarAoCarrinho = (produto) => {
//         let car = JSON.parse(localStorage.getItem("carrinho")) || []

//         car.push(produto)

//         localStorage.setItem("carrinho", JSON.stringify(car))

//         console.log("Produto adicionado:", produto)
//     }

//     const handleSubmitCarrinho = () => {
//         adicionarAoCarrinho(dados)
//     }

//     const [open, setOpen] = useState(false)
//     const [openAdd, setOpenAdd] = useState(false)

//     const handleCloseBackdrop = () => {
//         setOpen(false)
//         setOpenAdd(false)
//     }

//     const handleOpen = (nome, valor, categoria) => {
//         setDados({
//             nome,
//             valor,
//             categoria,
//         })
//         setOpen(true)
//     }

//     const handleOpenAddCategory = () => {
//         setOpenAdd(true);
//     };

//     useEffect(() => {
//         fetchCategorias()
//     }, [])

//     return (
//         <>
//             <div className="allContentFormProduct">
//                 <div className="allContent">
//                     <form className="formularioProdutos" onSubmit={handleSubmitCarrinho}>
//                         <h2>Cadastro de Produtos</h2>
//                         <p>É necessário preencher tudo.</p>
//                         <div className="divInputs">
//                             <TextField
//                                 name="nome"
//                                 onChange={handleChange}
//                                 id="outlined-basic"
//                                 label="Nome do produto"
//                                 variant="outlined"
//                                 sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                         "& fieldset": {
//                                             borderColor: "#28292b",
//                                         },
//                                         "&.Mui-focused fieldset": {
//                                             borderColor: "#28292b",
//                                         },
//                                     },
//                                     "& .MuiInputLabel-root": {
//                                         color: "#28292b",
//                                     },
//                                     "& .Mui-focused label": {
//                                         color: "#28292b",
//                                     },
//                                 }}
//                                 required
//                             />
//                             <Autocomplete
//                                 onChange={handleChangeValueName}
//                                 sx={(theme) => ({
//                                     zIndex: theme.zIndex.drawer - 1199,
//                                     "& .MuiOutlinedInput-root": {
//                                         "& fieldset": {
//                                             borderColor: "#28292b",
//                                         },
//                                         "&.Mui-focused fieldset": {
//                                             borderColor: "#28292b",
//                                         },
//                                     },
//                                     "& .MuiInputLabel-root": {
//                                         color: "#28292b",
//                                     },
//                                     "& .Mui-focused label": {
//                                         color: "#28292b",
//                                     },
//                                 })}
//                                 selectOnFocus
//                                 clearOnBlur
//                                 handleHomeEndKeys
//                                 id="free-solo-with-text-demo"
//                                 options={subCategorias}
//                                 value={valueCategoria.nome}
//                                 filterOptions={(options, params) => {
//                                     const filtered = filter(options, params);
//                                     const { inputValue } = params;
//                                     const trimInput = inputValue.trim().toLowerCase();

//                                     const isExisting = options.some((option) => trimInput === option?.nome.toLowerCase());
//                                     if (trimInput !== '' && !isExisting) {
//                                         filtered.push({
//                                             inputValue,
//                                             nome: `Adicionar uma nova subcategoria "${inputValue}"?`,
//                                         });
//                                     }

//                                     return filtered;
//                                 }}
//                                 groupBy={(option) => option?.categoriaNome}
//                                 getOptionLabel={(option) => {
//                                     if (typeof option === 'string') {
//                                         return (option);
//                                     }
//                                     if (option.inputValue) {
//                                         return (option.inputValue);
//                                     }
//                                     return (option.nome);
//                                 }}
//                                 renderOption={(props, option) => {
//                                     const { key, ...optionProps } = props;
//                                     return (
//                                         <li key={key} {...optionProps} className="li-option-icon">
//                                             <div>{option.nome}</div>
//                                             {option.nome.includes("?") ||
//                                                 <IconButton onClick={() => {
//                                                     handleOpen(option.nome, option.valor, option.categoriaNome)
//                                                     setValueCategoria(option)
//                                                 }}>
//                                                     <EditIcon />
//                                                 </IconButton>}
//                                         </li>
//                                     );
//                                 }}
//                                 renderGroup={(params) => (
//                                     <div key={params.key} className="group-options">
//                                         <h3>{params.group}</h3>
//                                         {params.children}
//                                     </div>
//                                 )}
//                                 freeSolo
//                                 renderInput={(params) => (
//                                     <TextField {...params} name="categoria" onChange={handleChange} onFocus={() => !subCategorias.length && fetchSubCategorias()} label="Subcategoria" required />
//                                 )}
//                                 onKeyDown={(event) => {
//                                     if (event.key === "Enter") {
//                                         return
//                                     }
//                                 }}
//                             />
//                             <div className="sendValor">
//                                 <TextField
//                                     id="outlined-basic"
//                                     name="valor"
//                                     slotProps={{
//                                         input: {
//                                             startAdornment: (
//                                                 <InputAdornment position="start">ETC$</InputAdornment>
//                                             ),
//                                         },
//                                     }}
//                                     onChange={handleChange}
//                                     type="number"
//                                     min="1"
//                                     label="Valor do produto"
//                                     variant="outlined"
//                                     value={valueCategoria.valor}
//                                     sx={{
//                                         width: '300px',
//                                         "& .MuiOutlinedInput-root": {
//                                             "& fieldset": {
//                                                 borderColor: "#28292b",
//                                             },
//                                             "&.Mui-focused fieldset": {
//                                                 borderColor: "#28292b",
//                                             },
//                                         },
//                                         "& .MuiInputLabel-root": {
//                                             color: "#28292b",
//                                         },
//                                         "& .Mui-focused label": {
//                                             color: "#28292b",
//                                         },
//                                     }}
//                                     required
//                                 />
//                                 <Tooltip title="Adicionar produto no carrinho">
//                                     <IconButton type="submit" size="large"><AddShoppingCartIcon fontSize="inherit" color="success" /></IconButton>
//                                 </Tooltip>
//                             </div>
//                             <Button
//                                 onClick={() => setOpenFormUser(true)}
//                                 variant="contained"
//                                 endIcon={<SendRoundedIcon />}
//                                 id='buttonEnviar'
//                             >
//                                 Finalizar troca
//                             </Button>
//                         </div>
//                     </form>
//                     {open && <EditarCategoria subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setOpen={setOpen} setDados={setDados} dados={dados} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} handleChangeValueName={handleChangeValueName} />}
//                     {openAdd && <AdicionarCategoria subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={openAdd} setDados={setDados} dados={dados} setOpenAdd={setOpenAdd} handleCloseBackdrop={handleCloseBackdrop} valueCategoria={valueCategoria} setValueCategoria={setValueCategoria} categorias={categorias} stateLoading={stateLoading} />}
//                     <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar o banco de dados" severity="error" />
//                     <Loading state={stateLoading} />
//                 </div>
//                 <Carrinho />
//             </div>
//             <FormUser openFormUser={openFormUser} setOpenFormUser={setOpenFormUser}/>
//         </>
//     );
// };

// export default FormProduct;

import {useState, useEffect} from 'react';
import axios from 'axios';

import FormUser from '../FormUser/FormUser.jsx';
import Carrinho from '../../components/Carrinho/Carrinho';
import AdicionarCategoria from '../AdicionarCategoria/AdicionarCategoria.jsx';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import "./FormProduct.css";

const FormProduct = () => {
  // * Dados do Formulário
  const [dadosFormProduct, setDadosFormProduct] = useState({
    nomeProduto: "",
    valorProduto: "",
    quantidade: "",
    categoriaProduto: "",
    subcategoriaProduto: "",
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setDadosFormProduct((prev) => ({
        ...prev,
        [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SubCategorias: ", subCategorias)
    console.log("Categorias: ", categorias)
    adicionarAoCarrinho(dadosFormProduct)
  };

  // * Pegando as categorias e subcategorias
  const [categorias,setCategorias] = useState([])
  const [subCategorias,setSubCategorias] = useState([])

    const fetchCategorias = async () => {
        // setStateLoading(true)
        try {
            const responde = await axios.get("http://localhost:3000/categorias");
            setCategorias(responde.data);
            // setStateLoading(false)
        } catch (err) {
            // setStateLoading(false)
            // setOpenAlertError(true)
            console.log("Erro: ", err)
        }
    }

    const fetchSubCategorias = async () => {
        try {
            const responde = await axios.get(`http://localhost:3000/subcategorias`);
            setSubCategorias(responde.data)
            // setStateLoading(false)
        } catch (err) {
            // setStateLoading(false)
            // setOpenAlertError(true)
            console.log("Erro: ", err)
        }
    }

    useEffect(() => {
        fetchCategorias()
        fetchSubCategorias()
    }, [])

    // * Limpa a subcategoria sempre que a categoria mudar
    useEffect(() => {
        setDadosFormProduct(prevState => ({
            ...prevState,
            subcategoriaProduto: ""
        }));
    }, [dadosFormProduct.categoriaProduto]);

    // * Botão de adicionar categoria
    const [open, setOpen] = useState(false)

    const handleOpenAddCategory = () => {
        setOpen(true)
    }

    const handleCloseBackdrop = () => {
        setOpen(false)
    }

    // * Carrinho
    const adicionarAoCarrinho = (produto) => {
        let car = JSON.parse(localStorage.getItem("carrinho")) || []

        car.push(produto)

        localStorage.setItem("carrinho", JSON.stringify(car))

        console.log("Produto adicionado:", produto)
    }

  return (
        <div className='box-form-comanda-carrinho'>
            <div className='content-product'>
                <div className='form-product'>
                    <h1>Adicionar produto</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='box-form-product'>
                            <div className='left-container'>
                                <div className='nome-produto'>
                                    <p>Nome do Produto:</p>
                                    <TextField
                                        value={dadosFormProduct.nomeProduto}
                                        name="nomeProduto"
                                        onChange={handleChange}
                                        size="small"
                                        variant="standard"
                                        sx={{
                                            width: '276px',
                                            '& .MuiInputBase-input': {
                                                fontSize: '14px',
                                                lineHeight: '1.2',
                                                padding: '4px 8px',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                height: '36px',
                                            },
                                            '& .MuiInput-underline:before': {
                                                borderBottom: 'none',
                                            },
                                            '& .MuiInput-underline:after': {
                                                borderBottom: 'none',
                                            },
                                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                borderBottom: 'none',
                                            },
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
                                            marginLeft: '12px',
                                            backgroundColor: '#DDDDDD',
                                            borderRadius: '8px',
                                            textDecoration: 'none'
                                        }}
                                        required
                                    />
                                </div>
                                <div className='valor-quantidade-produto'>
                                    <div className='valor-produto'>
                                        <p>Valor:</p>
                                        <TextField
                                            value={dadosFormProduct.valorProduto}
                                            name="valorProduto"
                                            onChange={handleChange}
                                            size="small"
                                            variant="standard"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment 
                                                            position="start"
                                                            sx={{
                                                                color: 'var(--third-color)',
                                                                marginTop: '-11px'
                                                            }}
                                                        >
                                                            ETC$
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            type="number"
                                            min="1"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontSize: '14px',
                                                    lineHeight: '1.2',
                                                    padding: '4px 8px',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    height: '36px',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                },
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
                                                marginLeft: '12px',
                                                backgroundColor: '#DDDDDD',
                                                borderRadius: '8px',
                                                textDecoration: 'none'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className='quantidade-produto'>
                                        <p>Quantidade:</p>
                                        <TextField
                                            value={dadosFormProduct.quantidade}
                                            name="quantidade"
                                            onChange={handleChange}
                                            size="small"
                                            variant="standard"
                                            type="number"
                                            min="1"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontSize: '14px',
                                                    lineHeight: '1.2',
                                                    padding: '4px 8px',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    height: '36px',
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
                                                margin: '0 12px 0 12px',
                                                backgroundColor: '#DDDDDD',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    startIcon={<AddShoppingCartIcon/>}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'var(--third-color)',
                                        width: '185px',
                                        height: '36.5px',
                                        textTransform: 'none',
                                        left: '444px',
                                        borderRadius: '1rem',
                                    }}
                                >
                                    Cadastrar produto
                                </Button>
                            </div>
                            <div className='categoria-produto'>
                                <p>Categoria do produto</p>
                                <FormControl
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '4px 8px',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none',
                                        },
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
                                        width: '276px',
                                        marginLeft: '12px',
                                        backgroundColor: '#DDDDDD',
                                        borderRadius: '8px',
                                        textDecoration: 'none'
                                    }}
                                    required
                                >
                                    <Select
                                        value={dadosFormProduct.categoriaProduto}
                                        name="categoriaProduto"
                                        onChange={handleChange}
                                    >
                                        {categorias ? categorias.map((value) => (
                                            <MenuItem key={value.id} value={value.nome}>{value.nome}</MenuItem>
                                        )) : <MenuItem value="">Selecione uma categoria</MenuItem>}
                                    </Select>
                                </FormControl>
                                <p>Subcategoria do produto</p>
                                <FormControl
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '4px 8px',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none',
                                        },
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
                                        width: '276px',
                                        marginLeft: '12px',
                                        backgroundColor: '#DDDDDD',
                                        borderRadius: '8px',
                                        textDecoration: 'none'
                                    }}
                                    required
                                >
                                    <Select
                                        value={dadosFormProduct.subcategoriaProduto}
                                        name="subcategoriaProduto"
                                        onChange={handleChange}
                                    >
                                        {dadosFormProduct.categoriaProduto ? (subCategorias.map((value) => {
                                            const categoriaSelecionada = categorias.find(
                                                (categoria) => categoria.nome === dadosFormProduct.categoriaProduto
                                            )

                                            return categoriaSelecionada && value.categoriaID === categoriaSelecionada.id ? (
                                                <MenuItem key={value.id} value={value.nome}>{value.nome}</MenuItem>
                                            ) : (null)
                                        })) : (
                                            <MenuItem value="">Selecione uma categoria</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <Button
                                    startIcon={<CategoryIcon/>}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'var(--third-color)',
                                        width: '274px',
                                        height: '36.5px',
                                        textTransform: 'none',
                                        margin: '10px 0 1rem 15px',
                                        borderRadius: '1rem',
                                    }}
                                    onClick={handleOpenAddCategory}
                                >
                                    Adicionar Categoria
                                </Button>
                            </div>
                        </div>
                    </form>
                    {open && <AdicionarCategoria categorias={categorias} subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setOpen={setOpen} handleCloseBackdrop={handleCloseBackdrop} dadosFormProduct={dadosFormProduct} setDadosFormProduct={setDadosFormProduct} />}
                </div>

                <div className='box-comanda'>
                    <FormUser/>
                </div>
            </div>

            <div className='box-carrinho'>
                {/* // * Botão de switch para escolher como serão mostrados os produtos */}

                {/* // * Barra de pesquisa (talvez sim, talvez não), não tem muita utilidade */}

                {/* // * Botão de Sort By */}

                <Carrinho />
            </div>
        </div>
  )
}

export default FormProduct
