const axios = require('axios');
const { faker } = require('@faker-js/faker');


const enviarProdutoTeste = async () => {
    try {
        const nome = faker.commerce.productName();
        const subcategoriaID = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6]);
        const caixaID = null
        const estoqueStatus = faker.helpers.arrayElement([0, 1]);
        const valor = parseFloat(faker.commerce.price());

        const produto = {
            nome,
            subcategoriaID,
            caixaID,
            estoqueStatus,
            valor
        };

        const resposta = await axios.post('http://localhost:3000/produtos/receive', produto);

        console.log('Produto adicionado:', resposta.data);
    } catch (error) {
        console.error('Erro ao enviar produto:', error.response ? error.response.data : error.message);
    }
};

for (let i = 0; i < 5; i++) {
    enviarProdutoTeste();
}
