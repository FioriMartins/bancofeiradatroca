import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import Caixas from '../Caixas/Caixas'

import "./ProductEstoque.css"

const ProductEstoque = ({ produtos, categorias, subCategorias, subcategorias, valor }) => {
    return (
        <div className="container-estoque-produtos">
            <div className="estoque-content-produtos">
                <p>PRODUTOS</p>
                <TableContainer
                    sx={{
                        marginLeft: '-20px',
                        borderRadius: '1rem',
                    }}
                >
                    <Table>
                        {/* <TableHead>
                            <TableRow>
                                <TableCell sx={{ opacity: '0.8', fontSize: '1rem', fontWeight: 'bold', borderBottom: 'none' }}>NOME</TableCell>
                                <TableCell sx={{ opacity: '0.8', fontSize: '1rem', fontWeight: 'bold', borderBottom: 'none' }}>CATEGORIA</TableCell>
                                <TableCell sx={{ opacity: '0.8', fontSize: '1rem', fontWeight: 'bold', borderBottom: 'none' }}>SUBCATEGORIA</TableCell>
                                <TableCell sx={{ opacity: '0.8', fontSize: '1rem', fontWeight: 'bold', borderBottom: 'none' }}>VALOR</TableCell>
                            </TableRow>
                        </TableHead> */}
                        {produtos.map((produto) => {
                            const subcategoriaProduto = subCategorias.find((sub) => {
                                const minValue = valor.min !== null ? valor.min : -Infinity;
                                const maxValue = valor.max !== null ? valor.max : Infinity;

                                const isWithinRange = (sub.valor >= minValue && sub.valor <= maxValue);

                                if (subcategorias.length > 0) {
                                    return sub.id === produto.subcategoriaID &&
                                        subcategorias.some((nome) => nome.toUpperCase() === sub.nome.toUpperCase()) &&
                                        isWithinRange;
                                } else {
                                    return sub.id === produto.subcategoriaID && isWithinRange;
                                }
                            });

                            const categoriaProduto = subcategoriaProduto && categorias.find(
                                (cat) => cat.id === subcategoriaProduto.categoriaID
                            )

                            return categoriaProduto && (
                                <TableBody>
                                    <TableRow key={produto.id}>
                                        <TableCell sx={{ borderBottom: 'none' }}>
                                            {produto.nome}
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none' }}>
                                            {categoriaProduto.nome}
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none' }}>
                                            {subcategoriaProduto.nome}
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: 'none' }}>
                                            {subcategoriaProduto.valor}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )
                        })}
                    </Table>
                </TableContainer>
            </div>
            <Caixas />
        </div>
    )
}

export default ProductEstoque
