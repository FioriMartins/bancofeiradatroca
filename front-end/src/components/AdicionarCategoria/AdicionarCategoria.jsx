import axios from 'axios'
import { useState } from 'react'

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import Backdrop from '@mui/material/Backdrop'
import Alerta from "../Alerta/Alerta"
import FormDeleteCategoria from "../FormDeleteCategoria/FormDeleteCategoria"
import EditarCategoria from "../EditarCategoria/EditarCategoria"

import "./AdicionarCategoria.css";

export default function AdicionarCategoria({ 
    open,
    setOpen,
    fetchCategorias,
    fetchSubCategorias,
    handleCloseBackdrop,
    dadosFormProduct,
    setDadosFormProduct,
    categorias,
    subCategorias
}) {
    const [openAlert, setOpenAlert] = useState(false)
    const [openAlertSubcategoria, setOpenAlertSubcategoria] = useState(false)
    const [openAlertAdd, setOpenAlertAdd] = useState(false)
    const [openAlertExists, setOpenAlertExists] = useState(false)
    const [openAlertDuplicate, setOpenAlertDuplicate] = useState(false)
    const [openAlertSubcategorias, setOpenAlertSubcategorias] = useState(false)
    const [openOptions, setOpenOptions] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [categoriaID, setCategoriaID] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let exists = false
    
        if (subcategorias.length === 0 || valor.length === 0) {
            console.error('Subcategorias e valores devem ser preenchidos.');
            setOpenAlertDuplicate(true)
            exists = true
            return;
        }

        if (valores.length > 0) {
            const subcategoriasSet = new Set();
            const hasDuplicateSubcategoria = valores.some(({ subcategoria }) => {
                if (subcategoriasSet.has(subcategoria)) {
                    return true;
                }
                subcategoriasSet.add(subcategoria);
                return false;
            });

            if (hasDuplicateSubcategoria) {
                console.error('Existem subcategorias duplicadas.');
                setOpenAlertDuplicate(true)
                exists = true
                return;
            }

            categorias.forEach(element => {
                if (element.nome.toUpperCase() === categoria.toUpperCase()) {
                    setOpenAlertExists(true)
                    exists = true
                }
            })

            if (!exists) {
                try {
                    const response = await axios.post('http://localhost:3000/categories/post', {
                        nome: categoria
                    });
                    console.log("Resposta do servidor: ", response.data)
                    handleAddSubCategoria(response.data.id)
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    const handleAddSubCategoria = async (categoriaID) => {
        let exists = false

        subCategorias.forEach((sub) => {
            subcategorias.forEach((newSub) => {
                if (sub.nome.toUpperCase() === newSub.toUpperCase()) {
                    setOpenAlertExists(true)
                    exists = true
                }
            })
        })

        if (!exists) {
            try {
                if (subcategorias.length !== valor.length) {
                    console.error('Os arrays subcategorias e valor devem ter o mesmo comprimento.');
                    setOpenAlertDuplicate(true)
                    return;
                }

                const data = subcategorias.map((subcategoria, index) => ({
                    nome: subcategoria,
                    valor: valor[index],
                    categoriaID: categoriaID
                }))

                const response = await axios.post('http://localhost:3000/categories/post/sub', {subcategorias: data})
                console.log("Resposta do servidor: ", response.data) 
                setOpenAlertAdd(true);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleOpenBackdropButton = (option) => {
        setOpenOptions(true)
        setCategoriaID(option)
    }

    const handleCloseBackdropButton = () => {
        if (openAlertAdd === true) {
            setOpenAlertAdd(false)
            setOpen(false)
            window.location.reload()
        }

        setOpenOptions(false)
        setOpenAlert(false)
        setOpenAlertAdd(false)
        setOpenAlertExists(false)
        setOpenAlertDuplicate(false)
        setOpenAlertSubcategorias(false)
    }

    const handleEditCategoria = (id) => {
        setOpenEdit(true)
        setCategoriaID(id)
    }
    const handleCloseEditCategoria = (id) => {
        setOpenEdit(false)
    }

    const handleDeleteCategoria = async (id) => {
        if (openOptions) {
            try {
                const response = await axios.delete(`http://localhost:3000/categories/delete/${id}`)
                console.log('Resposta do servidor: ', response.data)
                setOpenOptions(false)
                setOpenAlert(true)
                fetchCategorias()
            } catch (err) {
                setOpenOptions(false)
                console.error(err)

                if (err.response.data.original.errno === 1451) {
                    setOpenAlertSubcategorias(true)
                }
            }
        }
    }

    // * categoria, subcategorias e valores
    const [categoria, setCategoria] = useState('');
    const [subcategorias, setSubcategorias] = useState([]);
    const [valores, setValores] = useState([]);
    const [valor, setValor] = useState([]);

    const handleAddCategoria = (event) => {
        const value = event.target
        setCategoria(value.value);
    };

    const handleAddSubcategoria = (event, newValue) => {
        if (!newValue.some(value => value.includes(' '))) {
            setSubcategorias(newValue);
        }
    };

    const handleAddValor = (event, newValue) => {
        if (!newValue || newValue.length === 0) {
            setValores([]);
        } else if (newValue.length < valores.length) {
            setValores((prev) => prev.slice(0, newValue.length));
        } else if (valores.length < subcategorias.length) {
            const valorAdicionado = newValue[newValue.length - 1];
            setValores((prev) => [
                ...prev,
                { valor: parseInt(valorAdicionado, 10), subcategoria: subcategorias[prev.length % subcategorias.length] }
            ]);
            setValor((prev) => [
                ...prev,
                parseInt(valorAdicionado, 10)
            ])
        }
    };

    const handleDeleteValor = (index) => {
        setValores((prev) => prev.filter((_, i) => i !== index));
        setValor((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
                open={open}
                onClick={handleCloseBackdrop}
            >
                <form onSubmit={handleSubmit}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: `#f9f9f9`,
                            color: `black`,
                            width: `30dvw`,
                            borderRadius: `10px`,
                            paddingLeft: `1.5rem`,
                            paddingTop: `1px`,
                        }}
                    >
                        <h1>Adicionar categoria</h1>
                        <div className="box-form-add-category-backdrop">
                            <p>Categoria:</p>
                            <Autocomplete
                                sx={{
                                    width: '100%',
                                    '& .MuiInput-underline:before': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottom: 'none',
                                    },
                                    marginLeft: '12px',
                                    backgroundColor: '#DDDDDD',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                }}
                                size="small"
                                variant="standard"
                                freeSolo
                                options={categorias}
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
                                        <li
                                            key={key}
                                            {...optionProps}
                                            className="li-option-icon"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                            style={{ cursor: 'default' }}
                                        >
                                            <div>{option.nome}</div>
                                            <IconButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleEditCategoria(option.id);
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleOpenBackdropButton(option.id);
                                                }}
                                            >
                                                <DeleteForeverIcon />
                                            </IconButton>
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        value={categoria}
                                        onChange={handleAddCategoria}
                                        {...params}
                                        placeholder="Digite uma categoria"
                                        size="small"
                                        variant="standard"
                                        required
                                        sx={{
                                            height: '39px',
                                            '& .MuiInputBase-input': {
                                                fontSize: '17px',
                                            },
                                            paddingRight: '12px',
                                            paddingLeft: '12px',
                                            width: '94%',
                                            justifyContent: 'center',
                                        }}
                                    />
                                )}
                            />
                            <p>Subcategorias:</p>
                            <Autocomplete
                                multiple
                                sx={{
                                    width: '100%',
                                    '& .MuiInput-underline:before': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottom: 'none',
                                    },
                                    marginLeft: '12px',
                                    backgroundColor: '#DDDDDD',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                }}
                                variant="standard"
                                freeSolo
                                options={[]}
                                value={subcategorias}
                                onChange={handleAddSubcategoria}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const tagProps = getTagProps({ index });
                                        const { key, ...restTagProps } = tagProps;
                                        return (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                key={key}
                                                {...restTagProps}
                                            />
                                        )
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        sx={{
                                            minHeight: '39px',
                                            '& .MuiInputBase-input': {
                                                fontSize: '17px',
                                            },
                                            paddingRight: '12px',
                                            paddingLeft: '12px',
                                            width: '94%',
                                            justifyContent: 'center',
                                        }}
                                        variant="standard"
                                        {...params}
                                        placeholder="Digite e pressione Enter"
                                    />
                                )}
                            />
                            <p>Valores:</p>
                            <Autocomplete
                                multiple
                                sx={{
                                    width: '100%',
                                    '& .MuiInput-underline:before': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottom: 'none',
                                    },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                        borderBottom: 'none',
                                    },
                                    marginLeft: '12px',
                                    backgroundColor: '#DDDDDD',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                }}
                                variant="standard"
                                freeSolo
                                options={[]}
                                value={valores.map((item) => item.valor)}
                                onChange={(event, newValue) => handleAddValor(event, newValue)}
                                clearOnEscape
                                getOptionLabel={(option) => option.toString()}
                                isOptionEqualToValue={(option, value) => false}
                                disabled={subcategorias.length === 0}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const item = valores[index];
                                        const tagProps = getTagProps({ index });
                                        const { key, ...restTagProps } = tagProps;
                                        return (
                                            <Chip
                                                variant="outlined"
                                                label={`${item.subcategoria}: ${item.valor}`}
                                                key={key}
                                                {...restTagProps}
                                                onDelete={() => handleDeleteValor(index)}
                                            />
                                        )
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        sx={{
                                            minHeight: '39px',
                                            '& input[type=number]': {
                                                MozAppearance: 'textfield',
                                            },
                                            '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
                                                WebkitAppearance: 'none',
                                                margin: 0,
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
                                            '& .MuiInputBase-input': {
                                                fontSize: '17px',
                                            },
                                            paddingRight: '12px',
                                            width: '94%',
                                            justifyContent: 'center',
                                        }}
                                        variant="standard"
                                        {...params}
                                        placeholder={subcategorias.length > 0 ? `Digite até ${subcategorias.length} valores` : ''}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                              <>
                                                <InputAdornment
                                                  position="start"
                                                  sx={{
                                                    color: 'var(--third-color)',
                                                  }}
                                                >
                                                  ETC$
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                              </>
                                            ),
                                        }}
                                        type="number"
                                        inputProps={{
                                            ...params.inputProps,
                                            min: 1,
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="form-buttons">
                            <Button 
                                type='submit'
                                sx={{color: 'var(--third-color)'}}
                            >
                                Enviar
                            </Button>
                            <Button 
                                onClick={handleCloseBackdrop}
                                sx={{color: 'var(--third-color)'}}
                            >
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
                    <Alerta state={openAlertExists} onClose={handleCloseBackdropButton} text="Subcategoria já registrada com esse nome!" severity="error" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertDuplicate} onClose={handleCloseBackdropButton} text="Verifique se preencheu os dados corretamente!" severity="error" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertSubcategorias} onClose={handleCloseBackdropButton} text="Você não pode apagar porque tem subcategorias dentro desta categoria!" severity="error" />
                </div>
            </Backdrop>
            <FormDeleteCategoria openOptions={openOptions} handleCloseBackdropButton={handleCloseBackdropButton} handleDeleteCategoria={handleDeleteCategoria} categoriaID={categoriaID} />
            {openEdit && <EditarCategoria open={open} setOpen={setOpen} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} handleCloseEditCategoria={handleCloseEditCategoria} dadosFormProduct={dadosFormProduct} setDadosFormProduct={setDadosFormProduct} categorias={categorias} subCategorias={subCategorias} categoriaID={categoriaID} setCategoriaID={setCategoriaID} subcategorias={subcategorias} valores={valores} handleEditCategoria={handleEditCategoria} />}
        </div>
    )
}