import { useEffect, useState } from "react"
import './CronogramaMetrics.css'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

export default function CronogramaMetrics() {
    return (
        <div className="cronogramaContent">
            <h2>Cronograma</h2>
            <Stepper
                sx={{
                    width: 280,
                }}
                orientation="vertical"
                activeStep={0}
            >
                <Step
                    sx={{
                        '& .MuiStepIcon-active': {
                          backgroundColor: '#349854', // Cor verde quando ativo
                          color: 'white', // Cor do ícone quando ativo
                        },
                        '& .MuiStepIcon-completed': {
                          backgroundColor: '#349854', // Cor verde quando completado
                          color: 'white', // Cor do ícone quando completado
                        },
                      }}
                >
                    <StepLabel>
                        <p>Organização geral</p>
                    </StepLabel>
                    <StepContent>
                        <p id="dateCronogram">01-01-2025</p>
                        <p id="contentCronogram">O banco e as lojas devem se organizar da melhor forma possível.</p>
                    </StepContent>
                </Step>
                <Step
                    sx={{
                        '& .css-3hpdci-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
                            color: '#349854',
                        },
                    }}
                >
                    <StepLabel>
                        <p>Coleta de produtos</p>
                    </StepLabel>
                    <StepContent>
                        <p id="dateCronogram">01-01-2025</p>
                        <p id="contentCronogram">O banco deve recolher itens dos alunos para aumentar o estoque.</p>
                    </StepContent>
                </Step>
                <Step
                    sx={{
                        '& .MuiStepIcon-active': {
                            color: '#349854',
                        },
                    }}
                >
                    <StepLabel>
                        <p>Montagem das lojas</p>
                    </StepLabel>
                    <StepContent>
                        <p id="dateCronogram">01-01-2025</p>
                        <p id="contentCronogram">As salas devem ser organizadas e transformadas em loja.</p>
                    </StepContent>
                </Step>
                <Step
                    sx={{
                        '& .MuiStepIcon-active': {
                            color: '#349854',
                        },
                    }}
                >
                    <StepLabel>
                        <p>Feira da troca</p>
                    </StepLabel>
                    <StepContent>
                        <p id="dateCronogram">01-01-2025</p>
                        <p id="contentCronogram">O dia do evento.</p>
                    </StepContent>
                </Step>
            </Stepper>
        </div>
    )
}