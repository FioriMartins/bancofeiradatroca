const axios = require('axios');

const registrar = async () => {
    try {
        const produto = {
            username: "Pety",
            password: "p3ty!@"
        };

        const resposta = await axios.post('http://localhost:3000/register', produto);

        console.log('Usuario cadastrado:', resposta.data);
    } catch (error) {
        console.error('Erro ao enviar cadastro:', error.response ? error.response.data : error.message);
    }
}

registrar()