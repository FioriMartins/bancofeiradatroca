import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocs, collection } from "firebase/firestore"
import { db } from '../firebase/connect'

import './Comandas.css'

export default function Comandas() {
    const [comandas, setComandas] = useState([])
    const navigate = useNavigate()

    const goToAllComandas = () => navigate('/comandas/todos')

    const readComandas = async () => {
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                cArray.push({ id: doc.id, ...doc.data() })
            })

            setComandas(cArray)
            console.log(comandas.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas()
    }, [])

    return (
        <div className='content'>
            <div className='cadastroUsuario'>
                <h2>Formulário de Cadastro de Usuário</h2>
            </div>
            <div className='comandas' onClick={goToAllComandas}>
                <h2>Comandas</h2>
            </div>
        </div>
    )
}