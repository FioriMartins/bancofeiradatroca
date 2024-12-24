import { useState, useEffect, useRef, keyboardEvent } from 'react'
import { getDocs, getDoc, collection, doc, updateDoc } from "firebase/firestore"
import { db } from '../../firebase/connect'
import Tilt from 'react-vanilla-tilt'
import QRcode from 'qrcode'

import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import './FormComandas.css'

import Alerta from '../Alerta/Alerta'
import Loading from '../Loading/Loading'

export default function FormComandas({ backdropOpen, onClose, selectedValue, edit, name }) {
    const inputNome = useRef()
    const [option, setOption] = useState()
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()

    const handleCloseConfirm = (event, reason) => {
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
                            dark: '#12222a',
                            light: '#f2eee3',
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
                    dark: '#12222a',
                    light: '#f2eee3',
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
            setOption("inputLegal")
        } else {
            nextID()
            setOption("inputNext")
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

    const handleEdit = async () => {
        try {
            const referencia = doc(db, "comandas", edit)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && docSnap.data().ativo) {
                await updateDoc(referencia, {
                    nome: valueNome
                });
                localStorage.setItem('alerta', 'true')
                setStateLoading(false);
                setOpenEdit(true);

                location.reload()
            } else {
                console.error("Erro ao editar a comanda.")
                setOpenError(true)
                setStateLoading(false)
            }
        } catch (erro) {
            console.error("Erro ao editar: ", erro)
            setOpenError(true)
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            try {
                const referencia = doc(db, "comandas", edit)
                const docSnap = await getDoc(referencia)
    
                if (docSnap.exists() && docSnap.data().ativo) {
                    await updateDoc(referencia, {
                        nome: valueNome
                    });
                    localStorage.setItem('alerta', 'true')
                    setStateLoading(false);
                    setOpenEdit(true);
                    location.reload()
                } else {
                    console.error("Erro ao editar a comanda.")
                    setOpenError(true)
                    setStateLoading(false)
                }
            } catch (erro) {
                console.error("Erro ao editar: ", erro)
                setOpenError(true)
            }
        }
    }

    const handleKeyDownCadastro = async (e) => {
        if (e.key === "Enter") {
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
    }

    const handleDisable = async () => {
        try {
            const referencia = doc(db, "comandas", edit)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && docSnap.data().ativo) {
                await updateDoc(referencia, {
                    nome: "Desconhecido",
                    ativo: false,
                    saldo: 0
                });
                location.reload()
                setStateLoading(false);
            } else {
                console.error("O cartão já está desativado.")
            }
        } catch (erro) {
            console.error("Erro ao atualizar:", erro)
            setOpenError(true)
        }
    }

    function handleSelectText () {
        inputNome.current.select()
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
                            <div className='inputName'>
                                {
                                    edit !== null ? (
                                        <>
                                            <input type='text' defaultValue={name} ref={inputNome} id={option} onChange={handleChange} onKeyDown={valueNome && handleKeyDown}/>
                                            <IconButton sx={{ color: 'white' }} onClick={valueNome && handleEdit}>{valueNome ? <CreditScoreIcon /> : <EditIcon onClick={handleSelectText} />}</IconButton>
                                        </>
                                    ) : (
                                        <input type='text' placeholder='Desconhecido' ref={inputNome} id={option} onChange={handleChange} onKeyDown={valueNome && handleKeyDownCadastro}/>
                                    )
                                }
                            </div>
                        </div>
                    </Tilt>
                    {
                        edit !== null ? (
                            <div className="form-buttons">
                                <Button startIcon={<DeleteForeverIcon />} id='botoesDesativar' onClick={handleDisable} sx={{ width: `100%` }}>Desativar</Button>
                            </div>
                        ) : (
                            <div className="9-buttons">
                                <Button startIcon={<SendRoundedIcon />} id='botoes' onClick={handleSubmit} sx={{ width: `100%` }}>Cadastrar</Button>
                            </div>
                        )
                    }
                    <Alerta state={open} onClose={handleCloseConfirm} text="Usuário cadastrado com sucesso!" severity="success" />
                    <Alerta state={openError} onClose={handleCloseConfirm} text="Não foi possível cadastrar o Usuário!" severity="error" />
                    <Loading state={stateLoading} onClose={handleCloseConfirm} />
                </div>
            </div >
        </Backdrop >
    )
}