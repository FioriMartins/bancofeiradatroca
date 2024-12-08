import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocs, collection, doc, updateDoc } from "firebase/firestore"
import { db } from '../../firebase/connect'
import Tilt from 'react-vanilla-tilt'
import QRcode from 'qrcode'

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddCardIcon from '@mui/icons-material/AddCard';
import Button from '@mui/material/Button';

import './FormComandas.css'

import Alerta from '../Alerta/Alerta'
import Loading from '../Loading/Loading'

export default function FormComandas() {
    const inputNome = useRef()
    const [open, setOpen] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()
    const navigate = useNavigate()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
        setStateLoading(false)
    };

    const goToAllComandas = () => navigate('/comandas/todos')

    const readComandas = async () => {
        setStateLoading(true)
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                cArray.push({ id: doc.id, ...doc.data() })
            })
            
            setStateLoading(false)
            setComandas(cArray)
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
                        width: 300,
                        margin: 4,
                        color: {
                            dark: '#343c4c',
                            light: '#ffffff',
                        },
                        errorCorrectionLevel: 'H',
                    })
                    setValueID(comanda.id)
                    setValueSaldo(comanda.saldo)
                    inputNome.current.value = ""
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

    const handleChange = (e) => {
        const { value } = e.target

        setValueNome(value)
    }

    const handleSubmit = async () => {
        setStateLoading(true)
        try {
            const referencia = doc(db, "comandas", valueID);
            await updateDoc(referencia, {
                nome: valueNome,
                ativo: true
            })

            setStateLoading(false)
            setOpen(true)
            await readComandas()
            nextID()
        } catch (erro) {
            console.error("Erro ao atualizar:", erro)
        }
    }

    return (
        <>
            <div className="content-comanda">
                <Tilt className="card-comanda" options={{
                    max: 90,
                    scale: 2,
                    perspective: 50000,
                }} style={{ padding: 0 }}>
                    <div className='qrID'>
                        <p>{valueID}</p>
                        <img src={cardQR} draggable="false"></img>
                        <p id='escaneie'>Escaneie com uma câmera</p>
                    </div>
                    <div className='otherInfos'>
                        <p>{valueSaldo} ETC</p>
                        <input type='text' placeholder='Desconhecido' ref={inputNome} onChange={handleChange} />
                    </div>
                </Tilt>
                <div className="form-buttons">
                    <Button startIcon={<SendRoundedIcon />} id='botoes' onClick={handleSubmit}>Cadastrar</Button>
                    <Button startIcon={<AddCardIcon />} id='botoes' onClick={goToAllComandas}>Comandas</Button>
                </div>
            </div>
            <Alerta state={open} onClose={handleClose} text="Usuário cadastrado com sucesso!" severity="success"/>
            <Loading state={stateLoading} onClose={handleClose}/>
        </>
    )
}