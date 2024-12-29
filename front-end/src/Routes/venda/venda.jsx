import {useState, useEffect} from 'react'
import axios from 'axios'

export default function Venda () {
    const [vendas, setVendas] = useState({
        descricao: '',
        horario: '',
        dia: '',
        comandaId: '',
        detalhesJson: ''
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setVendas({
            ...vendas,
            [name]: value
        })
        console.log(vendas)
    }

    const enviarDados = async () => {
        try {
          const resposta = await axios.post('#', vendas);
      
          console.log('Dados enviados com sucesso:', resposta.data);
        } catch (erro) {
          console.error('Erro ao enviar os dados:', erro.response ? erro.response.data : erro.message);
        }
      };

    return (
        <> 
            <p>vender vender vender</p>
        </>
    )
}