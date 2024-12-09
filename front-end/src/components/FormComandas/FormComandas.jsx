import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocs, getDoc, collection, doc, updateDoc } from "firebase/firestore"
import { db } from '../../firebase/connect'
import Tilt from 'react-vanilla-tilt'
import QRcode from 'qrcode'

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop'

import './FormComandas.css'

import Alerta from '../Alerta/Alerta'
import Loading from '../Loading/Loading'

export default function FormComandas({ backdropOpen, onClose, selectedValue, edit }) {
    const inputNome = useRef()
    const [open, setOpen] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()
    const navigate = useNavigate()

    const handleCloseConfirn = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
        setOpenError(false)
        setStateLoading(false)
    };

    const handleClose = () => {
        onClose(selectedValue);
    };

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

    const selectedID = async () => {
        try {
            const referencia = doc(db, "comandas", edit)
            const docSnap = await getDoc(referencia)

            let imagensQR = await QRcode.toDataURL(docSnap.id, {
                width: 300,
                margin: 4,
                color: {
                    dark: '#343c4c',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'H',
            })

            setCardQR(imagensQR)
            setValueID(docSnap.id)
            setValueSaldo(docSnap.data().saldo)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
       
        if (edit !== null) {
            selectedID()
        } else {
            nextID()
        }
    }, [comandas])

    const handleChange = (e) => {
        const { value } = e.target

        setValueNome(value)
    }

    const handleSubmit = async ({ }) => {
        try {
            const referencia = doc(db, "comandas", valueID)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && !docSnap.data().ativo) {
                await updateDoc(referencia, {
                    nome: valueNome,
                    ativo: true
                });
                setStateLoading(false);
                setOpen(true);
                await readComandas();
                nextID();
            } else {
                console.error("O cartão já foi cadastrado por outro usuário.")
                setOpenError(true)
                setStateLoading(false)
            }
        } catch (erro) {
            console.error("Erro ao atualizar:", erro)
            setOpenError(true)
        }
    }

    const cadastrar = async () => {
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
            setOpenError(true)
        }
    }

    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 9999,
            })}
            onClick={handleClose}
            open={backdropOpen}>
            <div onClick={(e) => e.stopPropagation()}>
                <div className='content-comanda'>
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
                        <Button startIcon={<SendRoundedIcon />} id='botoes' onClick={handleSubmit} sx={{ width: `100%` }}>Cadastrar</Button>
                    </div>
                    <Alerta state={open} onClose={handleCloseConfirn} text="Usuário cadastrado com sucesso!" severity="success" />
                    <Alerta state={openError} onClose={handleCloseConfirn} text="Não foi possível cadastrar o Usuário!" severity="error" />
                    <Loading state={stateLoading} onClose={handleCloseConfirn} />
                </div>
            </div>
        </Backdrop>
    )
}