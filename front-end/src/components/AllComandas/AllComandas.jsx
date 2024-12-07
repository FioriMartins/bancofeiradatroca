import { useState, useEffect } from 'react'
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../firebase/connect'

import './AllComandas.css'

export default function AllComandasComponent() {
    const [comandas, setComandas] = useState([])

    const readComandas = async () => {
        try {
            const cArray = []
            const querySnapshot = await getDocs(collection(db, "comandas"))

            querySnapshot.forEach(async (doc) => {
                cArray.push({ id: doc.id, ...doc.data() })
            })

            setComandas(cArray)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas()
    }, [])

    return (
        <div className='comandas'>
            {comandas.map((comanda) => (
                <div className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'} key={comanda.id}>
                    <p>{comanda.id} - {comanda.nome}</p>
                </div>
            ))}
        </div>
    )
}