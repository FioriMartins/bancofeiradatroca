import { useState, useEffect } from 'react';
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
        const { name, value } = e.target
        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleChangeSubcategoriaAndValor = (e) => {
        const { name, value } = e.target
        const subcategoriasSelecionada = subCategorias.find(subcategoria => subcategoria.nome === value)

        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value,
            valorProduto: subcategoriasSelecionada.valor
        }))
    }

    const handleSubmit = () => {
        adicionarAoCarrinho(dadosFormProduct)
    };

    // * Pegando as categorias e subcategorias
    const [categorias, setCategorias] = useState([])
    const [subCategorias, setSubCategorias] = useState([])

    const fetchCategorias = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/categories/get");
            setCategorias(responde.data);
        } catch (err) {
            console.log("Erro: ", err)
        }
    }

    const fetchSubCategorias = async () => {
        try {
            const responde = await axios.get(`http://localhost:3000/categories/get/sub`);
            setSubCategorias(responde.data)
        } catch (err) {
            console.log("Erro: ", err)
        }
    }

    useEffect(() => {
        fetchCategorias()
        fetchSubCategorias()
    }, [])

    // * Limpa a subcategoriae valor sempre que a categoria mudar
    useEffect(() => {
        setDadosFormProduct(prevState => ({
            ...prevState,
            subcategoriaProduto: "",
            valorProduto: ""
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
                                            disabled
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
                                    startIcon={<AddShoppingCartIcon />}
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
                                        onChange={handleChangeSubcategoriaAndValor}
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
                                    startIcon={<CategoryIcon />}
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
                    <FormUser />
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
