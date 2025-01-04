import { useState, useEffect } from "react";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import './Carrinho.css'

export default function Carrinho() {
    const [carrinho, setCarrinho] = useState([]);

    useEffect(() => {
        const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];
        setCarrinho(carrinhoSalvo);
    }, []);

    return (
        <div className="carrinho">
            <h2>Carrinho</h2>
            {carrinho.length === 0 ? (
                <p>O carrinho está vazio.</p>
            ) : (
                <div className="carrinhoProd">
                    {carrinho.map((produto, index) => (
                        <div key={index} className="boxProduct">
                                <p>Nome: {produto.nomeProduto}</p>
                                <p>ETC$ {produto.valorProduto}</p>
                                <p>Quantidade: {produto.quantidade}</p>
                                <p>Categoria: {produto.categoriaProduto}</p>
                                <p>Subcategoria: {produto.subcategoriaProduto}</p>
                                <div className="carHeader">
                                <Button 
                                    aria-label="delete"
                                    onClick={() => {
                                        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

                                        // Remover o produto pelo índice
                                        carrinho.splice(index, 1);

                                        // Atualizar o localStorage
                                        localStorage.setItem("carrinho", JSON.stringify(carrinho));

                                        // * Talvez tenha uma forma de não precisar dar reloading e recarregar tudo de novo, 
                                        // * mas sim só o conteúdo do carrinho
                                        window.location.reload();
                                        console.log(
                                            "Produto removido. Carrinho atualizado:",
                                            carrinho
                                        );
                                    }}
                                    variant="outlined" 
                                    sx={{ color: "red", border: 'none' }} 
                                    startIcon={<DeleteForeverIcon />}
                                >
                                    {produto.nomeProduto}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
