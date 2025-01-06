const axios = require('axios');
// const { faker } = require('@faker-js/faker');


// const enviarProdutoTeste = async () => {
//     try {
//         const nome = faker.commerce.productName();
//         const subcategoriaID = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6]);
//         const caixaID = null
//         const estoqueStatus = faker.helpers.arrayElement([0, 1]);
//         const valor = parseFloat(faker.commerce.price());

//         const produtos = [
//             {
//                 nome,
//                 subcategoriaID,
//                 caixaID,
//                 estoqueStatus,
//                 valor
//             }, {
//                 nome,
//                 subcategoriaID,
//                 caixaID,
//                 estoqueStatus,
//                 valor
//             },
//         ];

//         const resposta = await axios.post('http://localhost:3000/produtos/receive', {
//             produtos: produtos,
//             comandaId: "F000",
//             tipo: "Troca por Créditos"
//         });

//         console.log('Produto adicionado:', resposta);
//     } catch (error) {
//         console.error('Erro ao enviar produto:', error.response ? error.response.data : error.message);
//     }
// };

// for (let i = 0; i < 5; i++) {
//     enviarProdutoTeste();
// }

// axios.get("http://localhost:6969/metrics/getComandas", { params: { filter: "week" } }).then((response) => {
//     console.log(response.data);
// });


// const enviarComanda = async () => {
//     try {
//         const response = await axios.post("http://localhost:6969/comandas/post", {
//             valueID: "F002",
//             valueNome: "Gabriel Pirocudo"
//         })

//         console.log("Resposta do servidor:", response)
//     } catch (error) {
//         console.error("Erro ao enviar a comanda:", error.response?.data || error.message);
//     }
// }

// enviarComanda()


// const enviarComanda = async () => {
//     try {
//         const response = await axios.post("http://localhost:6969/comandas/edit", {
//             valueIDedit: "F001",
//             valueNome: "Caio"
//         })

//         console.log("Resposta do servidor:", response)
//     } catch (error) {
//         console.error("Erro ao enviar a comanda:", error.response?.data || error.message);
//     }
// }

// enviarComanda()

axios
    .get('http://localhost:6969/auth/protected', {
        headers: { Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzM2MDM3Mjk4LCJleHAiOjE3MzYxMjM2OTh9.BOSa4nbGVN3YxVNDrX9-U7AOZnZLWzx8d-K-GAQKTdQ"}` },
    })
    .then((response) => {
        console.log(response)
    })
    .catch((err) => {
        console.error(err)
    })