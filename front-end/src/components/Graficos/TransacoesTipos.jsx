import { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart } from '@mui/x-charts/PieChart';
import PieChartIcon from '@mui/icons-material/PieChart';

import './graficos.css'

const Graficos = () => {
    const [quantidades, setQuantidades] = useState({ entrada: 0, saida: 0 })
    const [resumo, setResumo] = useState("Indefinido")

    const fetchMetricas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/graficos/transacoes/tipos")
            setQuantidades(response.data)
        } catch (err) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchMetricas()
    }, [])

    useEffect(() => {
        if (quantidades.entrada > quantidades.saida) {
            setResumo("As transações de entrada foram mais frequentes que as de saída durante o período observado.")
        } else if (quantidades.saida > quantidades.entrada) {
            setResumo("O gráfico mostra que as transações de saída superaram as de entrada ao longo do período analisado.")
        } else if (quantidades.saida === quantidades.entrada) {
            setResumo("O gráfico apresenta um equilíbrio entre as transações de entrada e saída.")
        }
    }, [quantidades])

    return (
        <div className='graficoBox'>
            <div className='iconetitle'>
                <PieChartIcon
                    sx={{
                        color: "#349854"
                    }}
                />
                <h3>Tipos de transações</h3>
            </div>
            <h4>{resumo}</h4>
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: quantidades.entrada, label: 'Entradas ' },
                            { id: 1, value: quantidades.saida, label: 'Saídas' },
                        ],
                    },
                ]}
                width={350}
                height={200}
            />
        </div>
    )
}

export default Graficos
