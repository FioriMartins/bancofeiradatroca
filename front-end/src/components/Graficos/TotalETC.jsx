import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { getDocs, collection, where, query } from "firebase/firestore"
import { db } from '../../firebase/connect'
import './graficos.css'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Tooltip from '@mui/material/Tooltip'

export default function TotalETC(filtro) {
    const [totalETC, setTotalETC] = useState(0)

    const [totalQuantidadeProdutos, setQuantidadeProdutos] = useState(0)
    const [statusQuantidadeProdutos, setStatusQuantidadeProdutos] = useState(0)

    const fetchComandas = async () => {
        try {
            const q = query(collection(db, "comandas"), where("ativo", "==", true))
            const querySnapshot = await getDocs(q)

            const totalSaldo = querySnapshot.docs.reduce((total, doc) => {
                const saldo = doc.data().saldo || 0
                return Number(total) + saldo
            }, 0)

            setTotalETC(totalSaldo)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchQuantidadeProdutos = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metricsTest", { params: { filter: `${filtro.filtro}` } })

            setQuantidadeProdutos(response.data.currentPeriodCount)
            setStatusQuantidadeProdutos(response.data.increasePercentage)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchComandas()
    }, [])

    useEffect(() => {
        fetchQuantidadeProdutos()
    }, [filtro])

    return (
        <>
            <div className='graficoBox' id='totalETC'>
                <div className='iconetitle'>
                    <div className='left'>
                        <AttachMoneyIcon sx={{
                            backgroundColor: '#EBEBEB',
                            borderRadius: '50%',
                            padding: '4px',
                            color: '#349854'
                        }} />
                        <p id="title">Total de ETC</p>
                    </div>
                    <div className='right'>
                        <TrendingUpIcon color="success" />
                        <p id='trendinggraphic'>+1,3%</p>
                    </div>
                </div>
                <b>$ {totalETC}</b>
            </div>
            <div className='graficoBox' id='comandasBox'>
                <div className='iconetitle'>
                    <div className='left'>
                        <CreditCardIcon sx={{
                            backgroundColor: '#EBEBEB',
                            borderRadius: '50%',
                            padding: '4px',
                            color: '#349854'
                        }} />
                        <p id="title">Comandas</p>
                    </div>
                    <div className='right'>
                        <TrendingUpIcon color="success" />
                        <p id='trendinggraphic'>+2%</p>
                    </div>
                </div>
                <div className='comandascadastradas'>
                    <p id='metric'>2/551</p>
                    <p id='subtitlemetric'>comandas cadastradas</p>
                </div>
            </div>
            <Tooltip title={
                <>
                 <p>TESTE TESTE</p>
                </>
            }
            followCursor>
                <div className='graficoBox' id='totalETC'>
                    <div className='iconetitle'>
                        <div className='left'>
                            <AttachMoneyIcon sx={{
                                backgroundColor: '#EBEBEB',
                                borderRadius: '50%',
                                padding: '4px',
                                color: '#349854'
                            }} />
                            <p id="title">Produtos</p>
                        </div>
                        <div className='right'>
                            {
                                statusQuantidadeProdutos >= 0 ? (
                                    <>
                                        <TrendingUpIcon color="success" />
                                        <p id='trendinggraphic'>{statusQuantidadeProdutos}%</p>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDownIcon color="error" />
                                        <p style={{ color: "#d32f2f" }}>{statusQuantidadeProdutos}%</p>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className='comandascadastradas'>
                        <p id='metric'>{totalQuantidadeProdutos}</p>
                        <p id='subtitlemetric'>itens nesse periodo</p>
                    </div>
                </div>
            </Tooltip>
        </>
    )
}