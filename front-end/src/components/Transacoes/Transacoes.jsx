import { useEffect, useState } from 'react'
import axios from 'axios'

import Paper from '@mui/material/Paper';

import './Transacoes.css'

export default function Transacoes() {
    const [transacoes, setTransacoes] = useState()

    const fetchTransacoes = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/transacoes")
            setTransacoes(responde.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchTransacoes()
    }, [])
    return (
        <div className='allContentTransacoes'>
            <h1>Histórico de transações</h1>
            {Array.isArray(transacoes) && transacoes.map((transacao) => (
                <Paper key={transacao.id} className='log' elevation={4}>
                    <p>Comanda ID: {transacao.comandaId}</p>
                    <p>Tipo: {transacao.tipo}</p>
                    <hr/>
                    <div className='timestamp'>
                        <i>{transacao.timestamp}</i>
                    </div>
                </Paper>
            ))}
        </div>
    )
}