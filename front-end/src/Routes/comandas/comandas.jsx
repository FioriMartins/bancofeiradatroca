import axios from 'axios'
import AllComandasComponent from "../../components/AllComandas/AllComandas";
import './comandas.css'
import { useEffect, useState } from 'react';


export default function Comandas() {
    const [registro, setRegistro] = useState([])

    const fetchRegistros = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comandas/registros')

            setRegistro(response.data)
            console.log(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchRegistros()
    }, [])
    return (
        <>
            <AllComandasComponent />
            <div className='registros'>
                <h1>Registro</h1>
                {
                    registro.map((el) => (
                        <div className='log'>
                            <p>{el.comanda_id._key.path.segments[6]}</p>
                            <p>{el.tipo}</p>
                            <p>{el.data_hora}</p>
                            <hr/>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
