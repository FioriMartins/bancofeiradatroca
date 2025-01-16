import { useEffect, useState, cloneElement } from 'react'
import axios from 'axios'
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartsLegend, PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import PieChartIcon from '@mui/icons-material/PieChart';

import './CategoriasMetrics.css'

const CategoriasMetrics = (filtro) => {
    const [alignment, setAlignment] = useState('categoria');

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment)
        }
    };

    const [quantidades, setQuantidades] = useState({ entrada: 0, saida: 0 })
    const [resumo, setResumo] = useState("Indefinido")
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    const [subCategoriaMetrics, setSubCategoriaMetrics] = useState([{
        label: 'Invalido',
        value: 1,
        color: 'gray'
    }])
    const [categoriaMetrics, setCategoriaMetrics] = useState([{
        label: 'Invalido',
        value: 1,
        color: 'gray'
    }])

    const fetchCategoriaMetrics = async () => {
        try {
            const responseSub = await axios.get("http://localhost:3000/metrics/getSubCategorias", { params: { filter: `${filtro.filtro}` } })
            const response = await axios.get("http://localhost:3000/metrics/getCategorias", { params: { filter: `${filtro.filtro}` } })
            setCategoriaMetrics(response.data.data)
            setSubCategoriaMetrics(responseSub.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategoriaMetrics()
    }, [])

    useEffect(() => {
        fetchCategoriaMetrics()
    }, [filtro])

    useEffect(() => {
        // let resumoFinal = []

        // categoriaMetrics.forEach((categoria) => {

        //     const subcategoriasRelacionadas = subCategoriaMetrics.filter(
        //         (sub) => sub.categoriaID === categoria.id
        //     )

        //     const tamanhoCategoria = subcategoriasRelacionadas.value;

        //     if (tamanhoCategoria > 5) {
        //         resumoFinal.push(`A categoria "${categoria.label}" possui um grande número de subcategorias (${tamanhoCategoria}).`)
        //     } else if (tamanhoCategoria <= 5 && tamanhoCategoria > 0) {
        //         resumoFinal.push(`A categoria "${categoria.label}" tem um número moderado de subcategorias (${tamanhoCategoria}).`)
        //     } 

        //     subcategoriasRelacionadas.forEach((sub) => {
        //         const tamanhoSubcategoria = sub.value

        //         if (tamanhoSubcategoria > 10) {
        //             resumoFinal.push(`A subcategoria "${sub.label}" possui muitos produtos (${tamanhoSubcategoria}).`)
        //         } else if (tamanhoSubcategoria > 0) {
        //             resumoFinal.push(`A subcategoria "${sub.label}" tem um número pequeno de produtos (${tamanhoSubcategoria}).`)
        //         }
        //     })
        // })

        setResumo("Somente os 5 primeiros em ordem crescente são mostrados.")
    }, [categoriaMetrics, subCategoriaMetrics])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) =>
                prevIndex === resumo.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Troca a cada 3 segundos

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    }, [resumo])

    const series = [
        {
            innerRadius: 0,
            outerRadius: 80,
            id: 'categorias',
            data: categoriaMetrics,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { additionalRadius: -10, color: 'gray' },

        },
        {
            innerRadius: 110,
            outerRadius: 140,
            id: 'subcategorias',
            data: subCategoriaMetrics,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { additionalRadius: -10, color: 'gray' },
        },
    ]


    function generate(element) {
        return categoriaMetrics.map((value, index) =>
            cloneElement(element, {
                key: index,
                children: (
                    <div className='legendGraphic'>
                        <div
                            style={{
                                backgroundColor: value.color,
                                width: 10,
                                height: 10,
                                borderRadius: 50
                            }}
                        ></div>
                        <p style={{ color: `rgba(0, 0, 0, 0.562)`, margin: 0 }}>{value.label}</p>
                    </div>
                ),
            })
        )
    }

    function generateSub(element) {
        return subCategoriaMetrics.map((value, index) =>
            cloneElement(element, {
                key: index,
                children: (
                    <div className='legendGraphic' style={{ opacity: value.value !== null ? 1 : 0.3 }}>
                        <div
                            style={{
                                backgroundColor: value.color,
                                width: 10,
                                height: 10,
                                borderRadius: 50
                            }}
                        ></div>
                        <p style={{ color: `rgba(0, 0, 0, 0.562)`, margin: 0 }}>{value.label}</p>
                    </div>
                ),
            })
        )
    }

    return (
        <div className="graficoBoxCategories">
            <div className="iconetitle">
                <PieChartIcon
                    sx={{
                        color: "#349854",
                    }}
                />
                <h3>Categorias</h3>
            </div>
            {
                resumo.length > 0 && (
                    <h4>Apenas os 5 primeiros itens, organizados em ordem crescente, são exibidos.</h4>
                )
            }
            <div className="graficoFoda">
                <PieChart
                    series={series}
                    width={400}
                    height={243}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                />
                <div className="listGraphic">
                    <ToggleButtonGroup
                        color="success"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        size="small"
                        sx={{
                            gap: 1,
                        }}
                    >
                        <ToggleButton
                            sx={{
                                color: "#349854",
                                border: '1px solid transparent',
                                borderRadius: 3,
                                fontSize: '12px',
                                "&:hover": {
                                    borderRadius: 3
                                },
                                "&.Mui-selected": {
                                    backgroundColor: "#349854",
                                    color: "white",
                                    borderRadius: 3
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: "#349854",
                                    color: "white",
                                    borderRadius: 3
                                },
                            }}
                            value="categoria"
                        >
                            <b>categoria</b>
                        </ToggleButton>
                        <ToggleButton
                            sx={{
                                color: "#349854",
                                border: '1px solid transparent',
                                borderRadius: 3,
                                fontSize: '12px',
                                "&:hover": {
                                    borderRadius: 3
                                },
                                "&.Mui-selected": {
                                    backgroundColor: "#349854",
                                    color: "white",
                                    borderRadius: 3
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: "#349854",
                                    color: "white",
                                    borderRadius: 3
                                },
                            }}
                            value="subcategoria"
                        >
                            <b>subcategoria</b>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {
                        alignment == "categoria" ?
                            generate(
                                <div>
                                    <div></div>
                                </div>
                            )
                            : generateSub(
                                <div>
                                    <div></div>
                                </div>
                            )
                    }
                    <i style={{ opacity: 0.6 }}>. . .</i>
                </div>
            </div>
        </div>
    )
}

export default CategoriasMetrics
