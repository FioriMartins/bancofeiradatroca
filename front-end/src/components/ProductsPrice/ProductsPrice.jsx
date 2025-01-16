import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import Backdrop from '@mui/material/Backdrop';

import "./ProductsPrice.css"

const ProductsPrice = ({ openPrice, handleClosePrice }) => {
    const [categorias, setCategorias] = useState([]);
    const [subCategorias, setSubCategorias] = useState([]);
    const [expanded, setExpanded] = useState({});

    const fetchCategorias = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/categories/get");
            setCategorias(responde.data);
        } catch (err) {
            console.log("Erro: ", err);
        }
    };

    const fetchSubCategorias = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/categories/get/sub");
            setSubCategorias(responde.data);
        } catch (err) {
            console.log("Erro: ", err);
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchSubCategorias();
    }, []);

    const handleExpandClick = (categoriaId) => {
        setExpanded((prev) => ({ ...prev, [categoriaId]: !prev[categoriaId] }));
    };

    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 9999 })}
                open={openPrice}
                onClick={handleClosePrice}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: `#f9f9f9`,
                        color: `black`,
                        width: `45dvw`,
                        borderRadius: `10px`,
                        paddingTop: `1px`,
                        paddingBottom: '1rem'
                    }}
                >
                    <h1 style={{ marginLeft: '20px', }}>Preços</h1>
                    <div>
                        <TableContainer
                            sx={{
                                minHeight: '298px',
                                maxHeight: '298px',
                                backgroundColor: '#f9f9f9',
                                // marginLeft: '-40px',
                                borderRadius: '1rem',
                            }}
                        >
                            <Table>
                                <TableBody>
                                    {categorias.map((categoria) => (
                                        <Fragment key={categoria.id}>
                                            <TableRow>
                                                <TableCell sx={{ fontSize: '16px', fontWeight: 'bold', borderBottom: 'none' }} colSpan={3}>
                                                    <IconButton onClick={() => handleExpandClick(categoria.id)}>
                                                        {expanded[categoria.id] ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                    {categoria.nome}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                                                    <Collapse in={expanded[categoria.id]} timeout="auto" unmountOnExit>
                                                        <Table size="small" aria-label="subcategorias">
                                                            <TableBody>
                                                                {subCategorias
                                                                    .filter((sub) => sub.categoriaID === categoria.id)
                                                                    .map((sub) => (
                                                                        <TableRow key={sub.id}>
                                                                            <TableCell sx={{ width: '530px', pr: 0, pl: 4, borderBottom: 'none' }}>{sub.nome}</TableCell>
                                                                            <TableCell sx={{borderBottom: 'none'}}>{sub.valor}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                            </TableBody>
                                                        </Table>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Backdrop>
        </div>
    );
};

export default ProductsPrice;
