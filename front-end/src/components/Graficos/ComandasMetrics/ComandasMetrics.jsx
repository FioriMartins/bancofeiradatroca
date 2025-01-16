import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './ComandasMetrics.css'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Tooltip from '@mui/material/Tooltip'

export default function ComandasMetrics(filtro) {
    const [quantidadeComandaAtiva, setQuantidadeComandaAtiva] = useState(0)


    const fetchQuantidadeComandas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getComandas", { params: { filter: `${filtro.filtro}` } })
            setQuantidadeComandaAtiva(response.data.currentPeriodCount.ativado)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchQuantidadeComandas()
    }, [])

    useEffect(() => {
        fetchQuantidadeComandas()
    }, [filtro])

    return (
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
                <p id='metric'>{quantidadeComandaAtiva}/550</p>
                <p id='subtitlemetric'>comandas cadastradas</p>
            </div>
        </div>
    )
}