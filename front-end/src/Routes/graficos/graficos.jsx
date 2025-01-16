import { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import TransacoesMetrics from '../../components/Graficos/TransacoesMetrics/TransacoesTipos'
import TotalETC from '../../components/Graficos/TotalETC/TotalETC'
import ProdutosMetrics from '../../components/Graficos/ProdutosMetrics/ProdutosMetrics'
import ComandasMetrics from '../../components/Graficos/ComandasMetrics/ComandasMetrics';
import CategoriasMetrics from '../../components/Graficos/CategoriasMetrics/CategoriasMetrics';

import CronogramaMetrics from '../../components/CronogramaMetrics/CronogramaMetrics';

import './graficos.css'

const Graficos = () => {
  const [saudacoes, setSaudacoes] = useState("Bom dia...")
  const [alignment, setAlignment] = useState('week');

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
    }
  };

  const now = new Date()
  const weekday = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    timeZone: "America/Sao_Paulo"
  })

  const letramaiuscula = weekday.charAt(0).toUpperCase() + weekday.slice(1)

  const day = now.getDate().toString().padStart(2, "0")
  const month = (now.getMonth() + 1).toString().padStart(2, "0")
  const year = now.getFullYear()
  const customDate = `${letramaiuscula}, ${day}-${month}-${year}`

  const hour = now.getHours()

  useEffect(() => {
    if (hour > 0 && hour < 12) {
      setSaudacoes("Bom dia...")
    } else if (hour > 12 && hour < 18) {
      setSaudacoes("Boa tarde...")
    } else if (hour >= 18 && hour < 23) {
      setSaudacoes("Boa noite...")
    }
  }, [])

  return (
    <div className='contentGraficos'>
      <div className='graficos'>
        <div className='headerDiv'>
          <div>
            <h1>{saudacoes}</h1>
            <h4>{customDate}</h4>
          </div>
          <div className='optionsGraficos'>
            <ToggleButtonGroup
              sx={{gap: 1, border: '1px solid #80808045', borderRadius: 4, padding: '5px' }}
              color="success"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton
                sx={{
                  color: "#349854",
                  border: '1px solid transparent',
                  borderRadius: 1,
                  height: 40,
                  width: 76,
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
                value="week">Semana</ToggleButton>
              <ToggleButton sx={{
                color: "#349854",
                border: '1px solid transparent',
                borderRadius: 1,
                height: 40,
                width: 76,
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
                value="month">Mês</ToggleButton>
              <ToggleButton sx={{
                color: "#349854",
                border: '1px solid transparent',
                borderRadius: 1,
                height: 40,
                width: 76,
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
                value="year">Ano</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className='graficosContentAll'>
          <TotalETC filtro={alignment} />
          <ComandasMetrics filtro={alignment} />
          <ProdutosMetrics filtro={alignment} />
          <TransacoesMetrics filtro={alignment} />
          <CategoriasMetrics filtro={alignment} />
        </div>
      </div>
      <CronogramaMetrics />
    </div>
  )
}

export default Graficos
