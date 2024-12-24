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
                            <div className="carHeader">
                                <Button 
                                    aria-label="delete"
                                    onClick={() => {
                                        let carrinho =
                                            JSON.parse(localStorage.getItem("carrinho")) || [];

                                        // Remover o produto pelo índice
                                        carrinho.splice(index, 1);

                                        // Atualizar o localStorage
                                        localStorage.setItem("carrinho", JSON.stringify(carrinho));

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
                                    {produto.nome}
                                </Button>
                            </div>
                                <p>ETC$ {produto.valor}</p>
                                <p>{produto.categoria.nome}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
