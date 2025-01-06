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

import "./AdicionarCategoria.css";

export default function AdicionarCategoria({ open, setOpen, fetchCategorias, fetchSubCategorias, handleCloseBackdrop, dadosFormProduct, setDadosFormProduct, categorias, subCategorias }) {
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
            if (element.nome.toUpperCase() === dadosFormProduct.nome.toUpperCase()) {
                setOpenAlertExists(true)
                exists = true
            }
        })

        if (exists === false) {
            try {
                await axios.post('http://localhost:3000/subcategorias/receive', {
                    nome: dadosFormProduct.nome,
                    valor: dadosFormProduct.valor,
                    categoriaID: dadosFormProduct.categoriaID
                })
                setOpenAlertSubcategoria(true)
            } catch (err) {
                console.log(err)
            }
        }
    }

    // const handleAddCategoria = async (nomeCategoria) => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/categorias/receive', {
    //             nome: nomeCategoria
    //         });

    //         const novaCategoria = response.data; // * Supondo que o backend retorna a categoria criada com o ID
    //         setDadosFormProduct({
    //             ...dadosFormProduct,
    //             categoriaNome: novaCategoria.nome,
    //             categoriaID: novaCategoria.id // * Atualiza com o ID retornado
    //         });

    //         setOpenAlertAdd(true);
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         await fetchCategorias();
    //         await fetchSubCategorias();
    //     }
    // };

    // // ! não está sendo usado
    // const handleChange = (event, newValue) => {
    //     const { name, value } = event.target

    //     if (typeof newValue === 'string') {
    //         setDadosFormProduct({
    //             ...dadosFormProduct,
    //             categoriaNome: newValue.nome,
    //             categoriaID: newValue.id
    //         })
    //         console.log(newValue)
    //     } else if (newValue && newValue.inputValue) {
    //         setDadosFormProduct(newValue.inputValue)
    //         handleAddCategoria(newValue.inputValue)
    //     } else {
    //         console.log(dadosFormProduct)
    //     }
    // }

    const handleChange = (e) => {
        const {name, value} = e.target
        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value,
        }))
        console.log("CategoriaForm: ", dadosFormProduct.categoriaProduto)
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

    // * categoria, subcategorias e valores
    const [categoria, setCategoria] = useState('');
    const [subcategorias, setSubcategorias] = useState([]);
    const [valores, setValores] = useState([]);
    const [inputValue, setInputValue] = useState('')

    const handleAddCategoria = (event, newValue) => {
        setCategoria(newValue);
    };

    const handleAddSubcategoria = (event, newValue) => {
        if (newValue.trim() === '') {
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
                { valor: valorAdicionado, subcategoria: subcategorias[prev.length % subcategorias.length] }
            ]);
        }
    };

    const handleDeleteValor = (index) => {
        setValores((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        // <>
        //     <Backdrop
        //         sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1000 })}
        //         open={open}
        //         onClick={handleCloseBackdrop}
        //     >
        //         <form onSubmit={handleSubmit}>
        //             <div onClick={(e) => e.stopPropagation()}
        //                 style={{ background: `#f5f5f5`, color: `#343c4c`, width: `30dvw`, borderRadius: `10px`, paddingLeft: `1.5rem`, paddingBottom: `1.5rem` }}>
        //                 <h1>Adicionar subcategoria</h1>
        //                 <Autocomplete
        //                     onChange={(event, newValue) => {
        //                         if (newValue && newValue.inputValue) {
        //                             handleAddCategoria(newValue.inputValue)
        //                         } else {
        //                             setDadosFormProduct({
        //                                 ...dadosFormProduct,
        //                                 categoriaNome: newValue.nome,
        //                                 categoriaID: newValue.id
        //                             })
        //                         }
        //                     }}
        //                     sx={{
        //                         "& .MuiOutlinedInput-root": {
        //                             "& fieldset": {
        //                                 borderColor: "#28292b",
        //                             },
        //                             "&.Mui-focused fieldset": {
        //                                 borderColor: "#28292b",
        //                             },
        //                         },
        //                         "& .MuiInputLabel-root": {
        //                             color: "#28292b",
        //                         },
        //                         "& .Mui-focused label": {
        //                             color: "#28292b",
        //                         },
        //                     }}
        //                     selectOnFocus
        //                     clearOnBlur
        //                     handleHomeEndKeys
        //                     id="free-solo-with-text-demo"
        //                     options={categorias}
        //                     value={dadosFormProduct.categoriaNome}
        //                     filterOptions={(options, params) => {
        //                         const filtered = filter(options, params);
        //                         const { inputValue } = params;
        //                         const trimInput = inputValue.trim().toLowerCase();

        //                         const isExisting = options.some((option) => trimInput === option?.nome.toLowerCase());
        //                         if (trimInput !== '' && !isExisting) {
        //                             filtered.push({
        //                                 inputValue,
        //                                 nome: `Adicionar categoria "${inputValue}"?`,
        //                             });
        //                         }

        //                         return filtered;
        //                     }}
        //                     getOptionLabel={(option) => {
        //                         if (typeof option === 'string') {
        //                             return (option);
        //                         }
        //                         if (option.inputValue) {
        //                             return (option.inputValue);
        //                         }
        //                         return (option.nome);
        //                     }}
        //                     renderOption={(props, option) => {
        //                         const { key, ...optionProps } = props;
        //                         return (
        //                             <li key={key} {...optionProps} className="li-option-icon">
        //                                 <div>{option.nome}</div>
        //                                 {option.nome.includes("?") || <IconButton onClick={() => handleOpenBackdropButton(option.id)}>
        //                                     <DeleteForeverIcon />
        //                                 </IconButton>}
        //                             </li>
        //                         );
        //                     }}
        //                     freeSolo
        //                     renderInput={(params) => (
        //                         <TextField {...params} name="categoriaNome" label="Categoria" variant="standard" required />
        //                     )}
        //                 />
        //                 <TextField
        //                     id="outlined-basic"
        //                     name="nome"
        //                     onChange={(event) => {
        //                         setDadosFormProduct({
        //                             ...dadosFormProduct,
        //                             nome: event.target.value
        //                         })
        //                     }}
        //                     type="string"
        //                     label="Subcategoria"
        //                     variant="standard"
        //                     value={dadosFormProduct.nome}
        //                     sx={{
        //                         "& .MuiOutlinedInput-root": {
        //                             "& fieldset": {
        //                                 borderColor: "#343c4c",
        //                             },
        //                             "&.Mui-focused fieldset": {
        //                                 borderColor: "#343c4c",
        //                             },
        //                         },
        //                         "& .MuiInputLabel-root": {
        //                             color: "#343c4c",
        //                         },
        //                         "& .Mui-focused label": {
        //                             color: "#343c4c",
        //                         },
        //                     }}
        //                     required
        //                 />
        //                 <TextField
        //                     id="outlined-basic"
        //                     name="valor"
        //                     slotProps={{
        //                         input: {
        //                             startAdornment: (
        //                                 <InputAdornment position="start">ETC$</InputAdornment>
        //                             ),
        //                         },
        //                     }}
        //                     onChange={(event) => {
        //                         setDadosFormProduct({
        //                             ...dadosFormProduct,
        //                             valor: event.target.value
        //                         })
        //                     }}
        //                     type="number"
        //                     min="1"
        //                     label="Valor do produto"
        //                     variant="standard"
        //                     value={dadosFormProduct.valor}
        //                     sx={{
        //                         "& .MuiOutlinedInput-root": {
        //                             "& fieldset": {
        //                                 borderColor: "#343c4c",
        //                             },
        //                             "&.Mui-focused fieldset": {
        //                                 borderColor: "#343c4c",
        //                             },
        //                         },
        //                         "& .MuiInputLabel-root": {
        //                             color: "#343c4c",
        //                         },
        //                         "& .Mui-focused label": {
        //                             color: "#343c4c",
        //                         },
        //                     }}
        //                     required
        //                 />
        //                 <div className="form-buttons">
        //                     <Button type='submit'>
        //                         Enviar
        //                     </Button>
        //                     <Button onClick={handleCloseBackdrop}>
        //                         Cancelar
        //                     </Button>
        //                 </div>
        //             </div>
        //         </form>
        //         <div onClick={(e) => e.stopPropagation()} >
        //             <Alerta state={openAlert} onClose={handleCloseBackdropButton} text="Categoria excluida com sucesso!" severity="warning" />
        //         </div>
        //         <div onClick={(e) => e.stopPropagation()}>
        //             <Alerta state={openAlertAdd} onClose={handleCloseBackdropButton} text="Categoria adicionada com sucesso!" severity="success" />
        //         </div>
        //         <div onClick={(e) => e.stopPropagation()}>
        //             <Alerta state={openAlertSubcategoria} onClose={handleCloseBackdropButton} text="Subategoria editada com sucesso!" severity="success" />
        //         </div>
        //         <div onClick={(e) => e.stopPropagation()}>
        //             <Alerta state={openAlertExists} onClose={handleCloseBackdropButton} text="Subcategoria já registrada com esse nome!" severity="error" />
        //         </div>
        //     </Backdrop>
        //     <FormDeleteCategoria openOptions={openOptions} handleCloseBackdropButton={handleCloseBackdropButton} handleDeleteCategoria={handleDeleteCategoria} />
        // </>

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
                                value={categoria}
                                onChange={handleAddCategoria}
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
                                                    handleOpenBackdropButton(option.id);
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
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            key={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
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
                                        required
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
                                        return (
                                            <Chip
                                                variant="outlined"
                                                label={`${item.subcategoria}: ${item.valor}`}
                                                key={option}
                                                {...getTagProps({ index })}
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
                                        required
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
            </Backdrop>
        </div>
    )
}