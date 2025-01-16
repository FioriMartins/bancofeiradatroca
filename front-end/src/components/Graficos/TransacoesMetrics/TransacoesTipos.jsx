import { useEffect, useState } from 'react'
import axios from 'axios'
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import PieChartIcon from '@mui/icons-material/PieChart';

import './TransacoesMetrics.css'

const TransacoesMetrics = (filtro) => {
    const [quantidades, setQuantidades] = useState({ entrada: 0, saida: 0 })
    const [resumo, setResumo] = useState("Indefinido")

    const fetchMetricas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getTrans", { params: { filter: `${filtro.filtro}` } })
            setQuantidades(response.data.currentPeriodCount)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchMetricas()
    }, [])

    useEffect(() => {
        fetchMetricas()
    }, [filtro])

    useEffect(() => {
        if (quantidades.entrada > quantidades.saida) {
            setResumo("As transações de entrada foram mais frequentes que as de saída durante o período observado.")
        } else if (quantidades.saida > quantidades.entrada) {
            setResumo("O gráfico mostra que as transações de saída superaram as de entrada ao longo do período analisado.")
        } else if (quantidades.saida === quantidades.entrada) {
            setResumo("O gráfico apresenta um equilíbrio entre as transações de entrada e saída.")
        }
    }, [quantidades])

    const palette = ['#349854', '#4CAF77']

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
            <div className='graficoFoda'>
                <PieChart
                    colors={palette}
                    series={[
                        {
                            data: [
                                { id: 0, value: quantidades.entrada, label: 'Entradas ' },
                                { id: 1, value: quantidades.saida, label: 'Saídas' },
                            ],
                            highlightScope: { fade: 'global', highlight: 'item' },
                            faded: { innerRadius: 0, additionalRadius: -10, color: 'gray' },
                        },
                    ]}
                    width={400}
                    height={243}
                    slotProps={{
                        legend: {
                            hidden: true
                        }
                    }}
                />
                <div className='listGraphicLegal'>
                    <div className='legendGraphic'>
                        <div
                            style={{
                                backgroundColor: '#349854',
                                width: 10,
                                height: 10,
                                borderRadius: 50
                            }}
                        ></div>
                        Entradas
                    </div>
                    <div className='legendGraphic'>
                        <div
                            style={{
                                backgroundColor: '#4CAF77',
                                width: 10,
                                height: 10,
                                borderRadius: 50
                            }}
                        ></div>
                        Saídas
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransacoesMetrics
