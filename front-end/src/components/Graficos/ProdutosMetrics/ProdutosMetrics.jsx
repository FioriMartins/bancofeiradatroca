import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './ProdutosMetrics.css'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Tooltip from '@mui/material/Tooltip'

export default function ProdutosMetrics(filtro) {
    const [totalETC, setTotalETC] = useState(0)

    const [totalQuantidadeProdutos, setQuantidadeProdutos] = useState(0)
    const [statusQuantidadeProdutos, setStatusQuantidadeProdutos] = useState(0)

    const [quantidadeComandaAtiva, setQuantidadeComandaAtiva] = useState(0)


    const fetchQuantidadeProdutos = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getStuff", { params: { filter: `${filtro.filtro}` } })

            setQuantidadeProdutos(response.data.currentPeriodCount)
            setStatusQuantidadeProdutos(response.data.increasePercentage)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchQuantidadeComandas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getComandas", { params: { filter: `${filtro.filtro}` } })
            setQuantidadeComandaAtiva(response.data.currentPeriodCount.ativado)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchQuantidadeProdutos()
        fetchQuantidadeComandas()
    }, [])

    useEffect(() => {
        fetchQuantidadeProdutos()
        fetchQuantidadeComandas()
    }, [filtro])

    return (
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
                            statusQuantidadeProdutos > 0 ? (
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
    )
}