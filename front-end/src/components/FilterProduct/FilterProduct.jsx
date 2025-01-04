import {useState} from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";

import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import RestoreIcon from '@mui/icons-material/Restore';

import "./FilterProduct.css"

const FilterProduct = ({produtos}) => {
    // * STATUS DO PRODUTO
    const [activeButton, setActiveButton] = useState("Todos");

    const handleButtonClick = (status) => {
      setActiveButton(status);
    };

    // * SUBCATEGORIAS SELECIONADAS
    const [selectedChips, setSelectedChips] = useState([]);

    const handleChipClick = (produto) => {
        if (selectedChips.includes(produto)) {
            setSelectedChips(selectedChips.filter((p) => p !== produto));
        } else {
            setSelectedChips([...selectedChips, produto]);
        }
    };

    // * ORDENAÇÃO DE PRODUTOS
    const [sortOrder, setSortOrder] = useState('a-z');

    const handleChange = (event) => {
        setSortOrder(event.target.value);
        // * Aqui você pode chamar uma função para ordenar sua lista, com base no valor selecionado
    };

    return (
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
                        {status} ({[1708, 1232, 250, 36][index]})
                    </Button>
                ))}
            </div>

            <p>CATEGORIA DO PRODUTO</p>
            <div className='container-filter'>
                {Array.isArray(produtos) && produtos.map((produto) => (
                    <Chip
                        key={produto.nome}
                        label={produto.nome}
                        onClick={() => handleChipClick(produto)}
                        clickable
                        color={selectedChips.includes(produto) ? "success" : "default"}
                        variant={selectedChips.includes(produto) ? "filled" : "outlined"}
                        sx={{ cursor: "pointer" }}
                    />
                ))}
            </div>

            <p>SUBCATEGORIA DO PRODUTO</p>
            <div className='container-filter'>
                <Autocomplete
                    multiple
                    options={produtos}
                    getOptionLabel={(produto) => produto.nome}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField {...params} label="Selecione uma subcategoria" variant="outlined" />
                    )}
                    sx={{ width: 300 }} 
                />
            </div>

            <p>ORDENAR POR</p>
            <FormControl sx={{
                width: '300px',
                maxWidth: '400px',
                padding: '4px 16px 4px 0',
                marginBottom: '2rem',
            }}>
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
                >
                    Resetar Filtros
                </Button>
            </div>
        </div>
    )
}

export default FilterProduct
