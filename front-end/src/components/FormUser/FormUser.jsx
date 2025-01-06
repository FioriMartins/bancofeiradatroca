import './FormUser.css'
import axios from 'axios'
import { useState, useEffect } from "react"
import { getDocs, collection, getFirestore, doc, updateDoc, increment } from "firebase/firestore"
import { db } from '../../firebase/connect'

import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import AddCardIcon from '@mui/icons-material/AddCard'
import Autocomplete from "@mui/material/Autocomplete"
import FormComandas from '../FormComandas/FormComandas'
import Button from '@mui/material/Button'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Backdrop from '@mui/material/Backdrop';

import Alerta from '../Alerta/Alerta'
import Loading from '../Loading/Loading'

import "../FormProduct/FormProduct.css";

export default function FormUser({openFormUser, setOpenFormUser}) {
    const [value, setValue] = useState(null)
    const [stateReadComanda, setStateReadComanda] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertError, setOpenAlertError] = useState(false)
    const [comandas, setComandas] = useState([])
    const [carrinho, setCarrinho] = useState([])
    const [total, setTotal] = useState(0)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const carrinho = JSON.parse(localStorage.getItem("carrinho"));
            if (!carrinho || carrinho.length === 0) {
                alert("O carrinho está vazio.")
                return
            }

            const produtos = carrinho.map((item) => ({
                nome: item.nome,
                subcategoriaID: item.categoria.id,
                valor: item.valor
            }))

            console.log("Carrinho ajustado:", produtos)

            const response = await axios.post("http://localhost:3000/stock/receive", {
                produtos: produtos,
                comandaId: dados.id,
                tipo: "Saida"
            })

            if (!response.status === 200) {
                console.error("Erro ao cadastrar produtos no MySQL.")
                return
            }

            const dinheiroTotal = carrinho.reduce((total, produto) => {
                const preco = produto.valor
                console.log(preco)
                return total + (isNaN(preco) ? 0 : preco)
            }, 0)

            if (dinheiroTotal <= 0) {
                alert("O valor total do carrinho é inválido.")
                return
            }

            const comandaRef = doc(db, "comandas", dados.id)

            await updateDoc(comandaRef, {
                saldo: increment(dinheiroTotal),
            });

            alert("Compra realizada com sucesso!")
            await localStorage.removeItem("carrinho")
            location.reload()
        } catch (error) {
            console.error("Erro ao processar a compra:", error)
            alert("Ocorreu um erro ao realizar a compra.")
        }
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlertError(false)
    }

    const readComandas = async () => {
        setStateLoading(true)
        try {
            if (!stateReadComanda) {
                const response = await axios.get('http://localhost:3000/comandas/get')
                const cArray = []

                response.data.forEach((doc) => {
                    if (doc.ativo) {
                        cArray.push(doc)
                    }
                })

                setStateReadComanda(true)
                setComandas(cArray)
            }

            setStateLoading(false)
        } catch (err) {
            setStateLoading(false)
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
    }

    const [dados, setDados] = useState({
        id: "",
        nome: ""
    })

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (valor) => {
        setOpen(false)
    }

    const handleCloseFormUser = () => {
        setOpenFormUser(false)
    }

    useEffect(() => {
        const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || []

        const totalCalculado = carrinhoSalvo.reduce((acc, carro) => acc + Number(carro.valorProduto * carro.quantidade), 0)
        setTotal(totalCalculado)

        setCarrinho(carrinhoSalvo)
    }, [])

    return (
        // <Backdrop
        //     open={openFormUser}
        //     onClick={handleCloseFormUser}
        // >
        //     <div className="formUser" onClick={(e) => e.stopPropagation()}>
        //         <h2>Formulário</h2>
        //         <p>Selecione ou cadastre uma comanda.</p>
        //         <form className="classUser" onSubmit={handleSubmit}>
        //             <p>ETC$: {carrinho.length === 0 ? (" Não há nenhum item no carrinho.") : (total)}</p>
        //             <div className='inputoes'>
        //                 <Autocomplete
        //                     value={dados.id}
        //                     id="free-solo-dialog-demo"
        //                     options={comandas}
        //                     getOptionLabel={(option) => {
        //                         if (typeof option === "string") {
        //                             return option;
        //                         }
        //                         if (option.inputValue) {
        //                             return option.inputValue;
        //                         }
        //                         return option.id;
        //                     }}
        //                     onChange={(event, newValue) => {
        //                         if (newValue === null) {
        //                             setDados({
        //                                 ...dados,
        //                                 id: undefined,
        //                             })
        //                         } else {
        //                             setDados({
        //                                 ...dados,
        //                                 id: newValue.id,
        //                             })
        //                         }
        //                     }}
        //                     selectOnFocus
        //                     clearOnBlur
        //                     handleHomeEndKeys
        //                     renderOption={(props, option) => {
        //                         const { key, ...optionProps } = props;
        //                         return (
        //                             <li key={key} {...optionProps}>
        //                                 {option.id} - {option.nome}
        //                             </li>
        //                         );
        //                     }}
        //                     sx={{
        //                         width: '275px',
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
        //                     freeSolo
        //                     renderInput={(params) => (
        //                         <TextField
        //                             name="comanda"
        //                             onChange={handleChange}
        //                             {...params}
        //                             label="Comanda"
        //                             onClick={readComandas}
        //                             required
        //                         />
        //                     )}
        //                     required
        //                 />
        //                 <IconButton size='large' onClick={handleClickOpen}>
        //                     <AddCardIcon fontSize='inherit' />
        //                 </IconButton>
        //             </div>
        //             <Button
        //                 type="submit"
        //                 variant="contained"
        //                 endIcon={<SendRoundedIcon />}
        //                 id='buttonEnviar'
        //             >
        //                 Enviar
        //             </Button>
        //         </form>
        //         <FormComandas
        //             edit={null}
        //             onClick={handleClickOpen}
        //             backdropOpen={open}
        //             onClose={handleClose}
        //         />
        //         <Alerta state={openAlertError} onClose={handleClose} text="Não foi possível acessar as comandas!" severity="error" />
        //         <Loading state={stateLoading} />
        //     </div>
        // </Backdrop>
        <div className="formUser">
            <h1>Selecionar comanda</h1>
            <form className="classUser" onSubmit={handleSubmit}>
                <p>ETC$: {carrinho.length === 0 ? (" Não há nenhum item no carrinho.") : (total)}</p>
                <div className='inputoes'>
                    <Autocomplete
                        value={dados.id}
                        id="free-solo-dialog-demo"
                        options={comandas}
                        getOptionLabel={(option) => {
                            if (typeof option === "string") {
                                return option;
                            }
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            return option.id;
                        }}
                        onChange={(event, newValue) => {
                            if (newValue === null) {
                                setDados({
                                    ...dados,
                                    id: undefined,
                                })
                            } else {
                                setDados({
                                    ...dados,
                                    id: newValue.id,
                                })
                            }
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li key={key} {...optionProps}>
                                    {option.id} - {option.nome}
                                </li>
                            );
                        }}
                        sx={{
                            width: '275px',
                            height: '90px',
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#343c4c",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#343c4c",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#343c4c",
                            },
                            "& .Mui-focused label": {
                                color: "#343c4c",
                            },
                        }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                name="comanda"
                                onChange={handleChange}
                                {...params}
                                label="Comanda"
                                onClick={readComandas}
                                required
                                sx={{
                                    top: '45px'
                                }}
                                size="small"
                            />
                        )}
                        required
                    />
                    <IconButton 
                        size='large'
                        onClick={handleClickOpen}
                        sx={{
                            marginTop: '39px'
                        }}
                    >
                        <AddCardIcon fontSize='inherit' />
                    </IconButton>
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendRoundedIcon />}
                    id='buttonEnviar'
                    sx={{
                        top: '18px',
                        borderRadius: '1rem'
                    }}
                >
                    Enviar
                </Button>
            </form>
            <FormComandas
                edit={null}
                onClick={handleClickOpen}
                backdropOpen={open}
                onClose={handleClose}
            />
        </div>
    )
}