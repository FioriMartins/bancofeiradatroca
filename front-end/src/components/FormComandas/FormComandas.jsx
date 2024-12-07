import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../firebase/connect'
import Tilt from 'react-vanilla-tilt'
import QRcode from 'qrcode'

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddCardIcon from '@mui/icons-material/AddCard';
import Button from "@mui/material/Button";

import './FormComandas.css'

export default function FormComandas() {
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()
    const navigate = useNavigate()

    const goToAllComandas = () => navigate('/comandas/todos')

    const readComandas = async () => {
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                cArray.push({ id: doc.id, ...doc.data() })
            })

            setComandas(cArray)
            console.log(comandas.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas()
    }, [])

    const nextID = async () => {
        for (let i = 0; i < comandas.length; i++) {
            let comanda = comandas[i]
            if (!comanda.ativo) {
                try {
                    let imagensQR = await QRcode.toDataURL(comanda.id, {
                        width: 300,         // Tamanho do QR Code
                        margin: 4,          // Margem ao redor do QR Code
                        color: {
                            dark: '#343c4c',   // Cor dos quadrados do QR
                            light: '#ffffff',  // Cor de fundo
                        },
                        errorCorrectionLevel: 'H',  // Nível de correção de erro (L, M, Q, H)
                    })
                    console.log(imagensQR)
                    setValueID(comanda.id)
                    setValueSaldo(comanda.saldo)
                    setValueNome(comanda.nome)
                    setCardQR(imagensQR)
                    break
                } catch (err) {
                    console.error("Erro ao gerar QR Code.")
                }
            }
        }
    }

    useEffect(() => {
        nextID()
    }, [comandas])

    const [dados, setDados] = useState({
        id: "",
        nome: "Desconhecido",
        saldo: "",
        ativo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
        console.log(dados)
    }

    const handleSubmit = () => {

    }

    return (
        <div className="content-comanda">
            <div className='cadastroUsuario'>
                <h2>Formulário de Cadastro de Comandas</h2>

                <form onSubmit={handleSubmit} key={"Form Comandas"} className="form-comandas">
                    <TextField
                        disabled
                        id="outlined-basic"
                        value={valueID}
                        name="ID"
                        onChange={handleChange}
                        type="text"
                        label="ID"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start"></InputAdornment>
                                ),
                            },
                        }}
                        variant="outlined"
                        sx={{
                            width: 231,
                            "& .MuiOutlinedInput-root": {
                                "& input": {
                                    color: "#343c4c", // Cor do texto dentro do input
                                },
                                "& fieldset": {
                                    color: "#343c4c",
                                    borderColor: "#343c4c",
                                },
                                "&.Mui-disabled fieldset": {
                                    borderColor: "#343c4c",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#343c4c",
                            },
                            "& .Mui-disabled label": {
                                color: "#343c4c",
                            },
                        }}
                    />


                    <TextField
                        name="nome"
                        onChange={handleChange}
                        id="outlined-basic"
                        label="Nome do cliente"
                        variant="outlined"
                        sx={{
                            width: 231,
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
                    />

                    <TextField
                        disabled
                        id="outlined-basic"
                        name="saldo"
                        value={valueSaldo}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ color: "#343c4c" }}>ETC$</InputAdornment>
                                ),
                            },
                        }}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        label="Saldo"
                        variant="outlined"
                        sx={{
                            width: 231,
                            "& .MuiOutlinedInput-root": {
                                "& input": {
                                    color: "#343c4c",
                                },
                                "& fieldset": {
                                    color: "#343c4c",
                                    borderColor: "#343c4c",
                                },
                                "&.Mui-disabled fieldset": {
                                    borderColor: "#343c4c",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#343c4c",
                            },
                            "& .Mui-disabled label": {
                                color: "#343c4c",
                            },
                        }}
                    />

                    <div className="form-buttons">
                        <Button startIcon={<SendRoundedIcon />}>Cadastrar</Button>
                        <Button startIcon={<AddCardIcon />} onClick={goToAllComandas}>Comandas</Button>
                    </div>
                </form>
            </div>

            <Tilt className="card-comanda" options={{
                max: 90,         // Aumente o valor para um ângulo maior de inclinação
                scale: 2,      // Aumenta o tamanho do objeto quando ele é inclinado
                perspective: 50000,  // Aumenta a profundidade do efeito
            }} style={{ padding: 0 }}>
                <div className='qrID'>
                    <p>{valueID}</p>
                    <img src={cardQR} draggable="false"></img>
                    <p id='escaneie'>Escaneie com uma câmera</p>
                </div>
                <div className='otherInfos'>
                    <p>{valueSaldo} ETC </p>
                    <p>{dados.nome}</p> 
                </div>
            </Tilt>

        </div>
    )
}