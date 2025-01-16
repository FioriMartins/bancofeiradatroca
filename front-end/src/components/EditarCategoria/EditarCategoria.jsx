import axios from 'axios'
import { useState } from 'react'

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton"
import Backdrop from '@mui/material/Backdrop'
import Alerta from "../Alerta/Alerta"
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearIcon from '@mui/icons-material/Clear';

import FormDeleteCategoria from "../FormDeleteCategoria/FormDeleteCategoria"

import "./EditarCategoria.css";

export default function EditarCategoria({
    open,
    setOpen,
    fetchCategorias,
    fetchSubCategorias,
    handleCloseEditCategoria,
    categorias,
    subCategorias,
    categoriaID,
}) {
    const [openAlert, setOpenAlert] = useState(false)
    const [openAlertSubcategoria, setOpenAlertSubcategoria] = useState(false)
    const [subcategoriaID, setSubcategoriaID] = useState(false)
    const [openAlertAdd, setOpenAlertAdd] = useState(false)
    const [openAlertExists, setOpenAlertExists] = useState(false)
    const [openAlertExistsCat, setOpenAlertExistsCat] = useState(false)
    const [openAlertEditSub, setOpenAlertEditSub] = useState(false)
    const [openOptions, setOpenOptions] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        let exists = false

        if (isEditing) {
            categorias.forEach(element => {
                if (element.nome.toUpperCase() === editedCategory.nome.toUpperCase() && !categoriaID === editedCategory.id) {
                    setOpenAlertExistsCat(true)
                    exists = true
                }
            })

            if (!exists) {
                try {
                    // * Editar categoria
                    const response = await axios.put(`http://localhost:3000/categories/edit/${categoriaID}`, {
                        nome: editedCategory.nome
                    })
                    console.log("Resposta do servidor: ", response.data)
                    setOpenAlertEditSub(true)
                    fetchCategorias()
                    handleEditSubcategoria(subcategoriaEditedID)
                } catch (err) {
                    console.log(err)
                }
            }
        } else {
            subCategorias.forEach(element => {
                if (element.nome.toUpperCase() === addSubcategoria.nome.toUpperCase()) {
                    setOpenAlertExists(true)
                    exists = true
                }
            })

            if (!exists) {
                try {
                    // * Adicionar subcategoria
                    const response = await axios.post('http://localhost:3000/categories/post/sub', { subcategorias: [addSubcategoria] })
                    console.log("Resposta do servidor: ", response.data)
                    setOpenAlertAdd(true);
                    setOpenAddSub(false);
                    fetchSubCategorias();
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    const handleEditSubcategoria = async (id) => {
        let exists = false

        subCategorias.forEach(element => {
            if (element.nome.toUpperCase() === editedName.nome.toUpperCase()) {
                setOpenAlertExists(true)
                exists = true
            }
        })

        if (!exists) {
            // * Editar subcategoria
            const response = await axios.put(`http://localhost:3000/categories/edit/sub/${id}`, {
                nome: editedName.nome,
                valor: editedValor.valor,
                categoriaID: categoriaID
            })
            console.log("Resposta do servidor: ", response.data)
            setOpenAlertEditSub(true)
            fetchSubCategorias();
        }
    }

    const handleOpenBackdropButton = (option) => {
        setOpenOptions(true)
        setSubcategoriaID(option)
    }

    const handleCloseBackdropButton = () => {
        if (openAlertSubcategoria === true) {
            setOpenAlertSubcategoria(false)
            setOpen(false)
        }

        setOpenOptions(false)
        setOpenAlert(false)
        setOpenAlertAdd(false)
        setOpenAlertExists(false)
        setOpenAlertExistsCat(false)
        setOpenAlertEditSub(false)
    }

    const handleDeleteSubcategoria = async (id) => {
        if (openOptions) {
            try {
                // * Delete categoria
                const response = await axios.delete(`http://localhost:3000/categories/delete/sub/${id}`)
                console.log('Resposta do servidor: ', response.data)
                setOpenOptions(false)
                setOpenAlert(true)
                fetchSubCategorias()
            } catch (err) {
                setOpenOptions(false)
                console.error(err)
            }
        }
    }

    const [isEditing, setIsEditing] = useState(false);
    const [openAddSub, setOpenAddSub] = useState(false)

    const handleEditValueCategoria = (e) => {
        e.preventDefault()
        if (isEditing) {
            setIsEditing(false);
            setSelectedSubcategorias([]);
            setActiveSubcategoria(null);
            setEditedCategory(categoria);
            setEditedName(subcategoria);
            setEditedValor(subcategoria);
        } else {
            setIsEditing(true);
        }
    };

    const handleAddSubcategoria = (e) => {
        e.preventDefault()
        setOpenAddSub(true);
    };

    const [addSubcategoria, setAddSubcategoria] = useState({
        nome: "",
        valor: "",
        categoriaID: categoriaID,
    })

    const handleChangeAddCategory = (e) => {
        const { name, value } = e.target

        name === "nome" ? setAddSubcategoria((prev) => ({
            ...prev,
            [name]: value,
        })) : setAddSubcategoria((prev) => ({
            ...prev,
            [name]: value ? parseInt(value, 10) : '',
        }))
    }

    const [selectedSubcategorias, setSelectedSubcategorias] = useState([]);
    const [activeSubcategoria, setActiveSubcategoria] = useState(null);
    const [subcategoriaEditedID, setSubcategoriaEditedID] = useState(null);

    const handleSelectSubcategoria = (subcategoria) => {
        setSelectedSubcategorias(prev =>
            prev.includes(subcategoria)
                ? prev.filter(item => item !== subcategoria)
                : [...prev, subcategoria]
        );
        setActiveSubcategoria(subcategoria.id === activeSubcategoria ? null : subcategoria.id);
        setSubcategoriaEditedID(subcategoria.id)
    };

    const categoria = categorias.find(cat => cat.id === categoriaID);
    const subcategoria = subCategorias.find(sub => sub.categoriaID === categoriaID);

    const [editedCategory, setEditedCategory] = useState(categoria);
    const [editedName, setEditedName] = useState(subcategoria);
    const [editedValor, setEditedValor] = useState(subcategoria);

    const handleChangeCategory = (field, value) => {
        setEditedCategory(prev => ({ ...prev, [field]: value }));
    };

    const handleChangeSubcategory = (id, field, value) => {
        field === "nome" ? setEditedName(prev => ({
            ...prev,
            [field]: value
        })) : setEditedValor(prev => ({
            ...prev,
            [field]: value ? parseInt(value, 10) : ''
        }))
    };

    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                open={open}
                onClick={handleCloseEditCategoria}
                invisible
            >
                <form onSubmit={handleSubmit}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: `#f9f9f9`,
                            color: `black`,
                            width: `50dvw`,
                            borderRadius: `10px`,
                            paddingLeft: `2.5rem`,
                            paddingTop: `1px`,
                        }}
                    >
                        <h1 style={{ marginLeft: '-20px', }}>Editar Categoria</h1>
                        <div>
                            <TableContainer
                                sx={{
                                    minHeight: '298px',
                                    maxHeight: '298px',
                                    backgroundColor: '#F2F2F2',
                                    marginLeft: '-20px',
                                    borderRadius: '1rem',
                                }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {/* //* Título e botões */}
                                            <TableCell
                                                colSpan={2}
                                                sx={{
                                                    backgroundColor: '#F2F2F2',
                                                    fontWeight: 'bold',
                                                    textAlign: 'left',
                                                    padding: '24px',
                                                    fontSize: '18px',
                                                }}
                                            >
                                                {isEditing ? (
                                                    <TextField
                                                        value={editedCategory.nome}
                                                        onChange={(e) => handleChangeCategory('nome', e.target.value)}
                                                        size="small"
                                                    />
                                                ) : (
                                                    categoria.nome
                                                )}
                                            </TableCell>
                                            <TableCell align="left" colSpan={1}>
                                                {openAddSub ? (
                                                    <Button
                                                        type="submit"
                                                        endIcon={<PlaylistAddCheckIcon sx={{ height: '1.5rem', width: '1.5rem' }} />}
                                                        sx={{
                                                            color: 'black',
                                                            borderRadius: '0.5rem'
                                                        }}
                                                    >
                                                        Enviar
                                                    </Button>
                                                ) : (
                                                    isEditing ? (
                                                        <Button
                                                            onClick={handleEditValueCategoria}
                                                            endIcon={<MoreVertIcon />}
                                                            sx={{
                                                                color: 'black',
                                                                borderRadius: '0.5rem'
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={handleAddSubcategoria}
                                                            endIcon={<PlaylistAddIcon sx={{ height: '1.5rem', width: '1.5rem' }} />}
                                                            sx={{
                                                                color: 'black',
                                                                borderRadius: '0.5rem'
                                                            }}
                                                        >
                                                            Novo
                                                        </Button>
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell align="right" colSpan={1}>
                                                {isEditing ? (
                                                    <Button
                                                        type="submit"
                                                        endIcon={<MoreVertIcon />}
                                                        sx={{
                                                            color: 'black',
                                                            borderRadius: '0.5rem'
                                                        }}
                                                    >
                                                        Salvar
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={handleEditValueCategoria}
                                                        endIcon={<MoreVertIcon />}
                                                        sx={{
                                                            color: 'black',
                                                            borderRadius: '0.5rem'
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        {/* // * Nome dos campos */}
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', }}>
                                                ID
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', }}>Subcategoria</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', }} align="left">Valor</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', }} align="right">Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* // * Opcões botão de adicionar subcategoria */}
                                        {openAddSub &&
                                            <TableRow key={subCategorias[subCategorias.length - 1].id + 1}>
                                                <TableCell align="center">
                                                    {subCategorias[subCategorias.length - 1].id + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={addSubcategoria.nome}
                                                        name="nome"
                                                        onChange={handleChangeAddCategory}
                                                        size="small"
                                                        required
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        value={addSubcategoria.valor}
                                                        name="valor"
                                                        onChange={handleChangeAddCategory}
                                                        size="small"
                                                        type="number"
                                                        min="1"
                                                        required
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => (setOpenAddSub(false), setAddSubcategoria({ nome: "", valor: "" }))}>
                                                        <ClearIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        }
                                        {/* // * Todas as subcategorias da categoria */}
                                        {subCategorias.filter(subcategoria => subcategoria.categoriaID === categoriaID).map((subcategoria, index) => (
                                            <TableRow key={subcategoria.id}>
                                                <TableCell align={isEditing ? "left" : "center"}>
                                                    {isEditing ? (
                                                        <>
                                                            <Checkbox
                                                                checked={selectedSubcategorias.includes(subcategoria)}
                                                                onChange={() => handleSelectSubcategoria(subcategoria)}
                                                                disabled={activeSubcategoria !== null && subcategoria.id !== activeSubcategoria}
                                                            />
                                                            {subcategoria.id}
                                                        </>
                                                    ) : (
                                                        subcategoria.id
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing && selectedSubcategorias.includes(subcategoria) ? (
                                                        <TextField
                                                            value={editedName.nome}
                                                            onChange={(e) => handleChangeSubcategory(subcategoria.id, 'nome', e.target.value)}
                                                            size="small"
                                                            required
                                                        />
                                                    ) : (
                                                        subcategoria.nome
                                                    )}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {isEditing && selectedSubcategorias.includes(subcategoria) ? (
                                                        <TextField
                                                            value={editedValor.valor}
                                                            onChange={(e) => handleChangeSubcategory(subcategoria.id, 'valor', e.target.value)}
                                                            size="small"
                                                            type="number"
                                                            min="1"
                                                            required
                                                        />
                                                    ) : (
                                                        subcategoria.valor
                                                    )}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => handleOpenBackdropButton(subcategoria.id)}>
                                                        <DeleteForeverIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="form-buttons">
                            <Button
                                onClick={handleCloseEditCategoria}
                                sx={{ color: 'var(--third-color)', marginLeft: '670px' }}
                            >
                                Voltar
                            </Button>
                        </div>
                    </div>
                </form>
                <div onClick={(e) => e.stopPropagation()} >
                    <Alerta state={openAlert} onClose={handleCloseBackdropButton} text="Subcategoria excluida com sucesso!" severity="warning" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertAdd} onClose={handleCloseBackdropButton} text="Subcategoria adicionada com sucesso!" severity="success" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertExists} onClose={handleCloseBackdropButton} text="Subcategoria já registrada com esse nome nas categorias!" severity="error" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertExistsCat} onClose={handleCloseBackdropButton} text="Categoria já registrada com esse nome!" severity="error" />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <Alerta state={openAlertEditSub} onClose={handleCloseBackdropButton} text="Categoria/Subcategoria editada com sucesso!" severity="success" />
                </div>
            </Backdrop>
            <FormDeleteCategoria openOptions={openOptions} handleCloseBackdropButton={handleCloseBackdropButton} handleDeleteSubcategoria={handleDeleteSubcategoria} categoriaID={subcategoriaID} />
        </div>
    )
}   