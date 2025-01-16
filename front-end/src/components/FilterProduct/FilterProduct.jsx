import { useState, useEffect } from 'react';
import axios from 'axios'

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from "@mui/material/ListSubheader";
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import RestoreIcon from '@mui/icons-material/Restore';

import ProductEstoque from "../../components/ProductEstoque/ProductEstoque.jsx"

import "./FilterProduct.css"

const FilterProduct = ({ produtos }) => {
    // * PEGANDO AS CATEGORIAS E SUBCATEGORIAS
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

    // * STATUS DO PRODUTO
    const [activeButton, setActiveButton] = useState("Todos");

    const filterProductsByStatus = (status) => {
        if (status === "Ativado") {
            return produtos.filter(produto => produto.estoqueStatus !== 0);
        } else if (status === "Desativado") {
            return produtos.filter(produto => produto.estoqueStatus === 0);
        } else if (status === "Todos") {
            return produtos;
        }
    };

    const handleButtonClick = (status) => {
        setActiveButton(status);
    };

    // * ORDENAÇÃO DE PRODUTOS
    const [sortOrder, setSortOrder] = useState('a-z');

    const alfabeto = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    const sortProducts = (products) => {
        return [...products].sort((a, b) => {
            const firstLetterA = a.nome[0].toUpperCase();
            const firstLetterB = b.nome[0].toUpperCase();
            const comparison = alfabeto.indexOf(firstLetterA) - alfabeto.indexOf(firstLetterB);
            return sortOrder === 'a-z' ? comparison : -comparison;
        });
    };

    const handleChange = (event) => {
        setSortOrder(event.target.value);
    };

    // * INICIALIZAR PRODUTOS ORDENADOS
    const sortedProducts = sortProducts(filterProductsByStatus(activeButton));

    // * VALOR MÁXIMO E MÍNIMO
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const valor = {min: minPrice, max: maxPrice};

    // * CATEGORIAS SELECIONADAS
    const [selectedChips, setSelectedChips] = useState([]);

    const handleChipClick = (cat) => {
        if (selectedChips.includes(cat)) {
            setSelectedChips(selectedChips.filter((selectCat) => selectCat !== cat));
        } else {
            setSelectedChips([...selectedChips, cat]);
        }
    };

    // * SUBCATEGORIAS SELECIONADAS
    const [subcategorias, setSubcategorias] = useState([])

    const handleChangeSubcategoria = (e) => {
        const { value } = e.target;

        setSubcategorias(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // * PRODUTOS ATIVADOS E DESATIVADOS
    let isActivated = 0;
    let isDisabled = 0;

    produtos.forEach((value) => {
        if (value.estoqueStatus !== 0) {
            isActivated++;
        } else {
            isDisabled++;
        }
    });

    // * RESETAR FILTROS
    const resetFilter = () => {
        setActiveButton("Todos");
        setSelectedChips([])
        setSubcategorias([])
        setSortOrder('a-z');
        setMinPrice(null);
        setMaxPrice(null);
    }

    return (
        <div className="container-estoque">
            <div className="content">
                <p>STATUS DO PRODUTO</p>
                <div className='container-filter'>
                    {["Todos", "Ativado", "Desativado"].map((status, index) => (
                        <Button
                            key={index}
                            variant={activeButton === status ? "contained" : "outlined"}
                            color="success"
                            onClick={() => handleButtonClick(status)}
                            sx={{
                                minWidth: "160px",
                            }}
                        >
                            {status} ({[produtos && produtos.length, isActivated, isDisabled][index]})
                        </Button>
                    ))}
                </div>

                <p>CATEGORIAS</p>
                <div className='container-filter'>
                    {categorias.map((cat) => (
                        <Chip
                            key={cat.id}
                            label={cat.nome}
                            onClick={() => handleChipClick(cat)}
                            clickable
                            color={selectedChips.includes(cat) ? "success" : "default"}
                            variant={selectedChips.includes(cat) ? "filled" : "outlined"}
                            sx={{ cursor: "pointer" }}
                        />
                    ))}
                </div>

                <p>SUBCATEGORIAS</p>
                <div className='container-filter'>
                    <FormControl
                        sx={{
                            width: '300px',
                            maxWidth: '400px',
                            padding: '4px 16px 4px 0',
                        }}
                    >
                        <Select
                            multiple
                            value={subcategorias}
                            onChange={handleChangeSubcategoria}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={value}
                                            sx={{
                                                margin: '2px',
                                                backgroundColor: '#DDDDDD',
                                                color: '#28292b',
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {selectedChips.length > 0 ? (
                                selectedChips.map((categoria) => (
                                    [
                                        <ListSubheader key={`subheader-${categoria.id}`}>{categoria.nome}</ListSubheader>,
                                        ...subCategorias
                                            .filter((sub) => sub.categoriaID === categoria.id)
                                            .map((value) => (
                                                <MenuItem key={value.id} value={value.nome}>
                                                    {value.nome}
                                                </MenuItem>
                                            ))
                                    ]
                                ))
                            ) : (
                                <MenuItem value="">Selecione uma categoria</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </div>

                <p>ORDENAR POR</p>
                <FormControl
                    sx={{
                        width: '300px',
                        maxWidth: '400px',
                        padding: '4px 16px 4px 0',
                        marginBottom: '2rem',
                    }}
                >
                    <Select
                        value={sortOrder}
                        onChange={handleChange}
                        sx={{
                            textAlign: 'right',
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <SortByAlphaIcon sx={{ color: 'gray' }} />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="a-z">A-Z</MenuItem>
                        <MenuItem value="z-a">Z-A</MenuItem>
                    </Select>
                </FormControl>

                <p>PREÇO</p>
                <div className='price-container'>
                    <TextField
                        variant="outlined"
                        placeholder="Preço mínimo"
                        value={minPrice !== null ? minPrice : ''}
                        onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value, 10) : null)}
                        type="number"
                        min="1"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{
                                        color: 'var(--third-color)',
                                        position: 'relative',
                                        top: '4px',
                                    }}>
                                        ETC$:
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            borderRadius: '8px',
                            input: { color: '#000' },
                        }}
                    />

                    <TextField
                        variant="outlined"
                        placeholder="Preço máximo"
                        value={maxPrice !== null ? maxPrice : ''}
                        onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : null)}
                        type="number"
                        min="1"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{
                                        color: 'var(--third-color)',
                                        position: 'relative',
                                        top: '4px',
                                    }}>
                                        ETC$:
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            borderRadius: '8px',
                            input: { color: '#000' },
                        }}
                    />
                </div>

                <div className='reset-filters'>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '1rem'
                        }}
                        startIcon={<RestoreIcon />}
                        onClick={resetFilter}
                    >
                        Resetar Filtros
                    </Button>
                </div>
            </div>
            <ProductEstoque produtos={sortedProducts} categorias={selectedChips.length > 0 ? selectedChips : categorias} subCategorias={subCategorias} subcategorias={subcategorias} valor={valor} />
        </div>
    )
}

export default FilterProduct
