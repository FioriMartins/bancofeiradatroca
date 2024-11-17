const cron = require('node-cron')
const axios = require('axios')

// Arrays preenchidos anteriormente
const desc = [
    "Pizza de Calabresa",
    "Hambúrguer de Frango",
    "Sushi Combo",
    "Espaguete à Bolonhesa",
    "Salada Caesar",
    "Café Expresso",
    "Torta de Limão",
    "Suco de Laranja",
    "Bife à Parmegiana",
    "Panqueca de Chocolate"
];

const hours = [
    "12:00",
    "14:30",
    "16:45",
    "18:20",
    "20:00",
    "21:15",
    "10:30",
    "13:15",
    "15:50",
    "19:10"
];

const day = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
    "Segunda-feira",
    "Quarta-feira",
    "Sexta-feira"
];

const comandaId = Array.from({ length: 10 }, () => {
    const randomNumber = Math.floor(Math.random() * (550 - 0 + 1)) + 0;
    return `F${randomNumber.toString().padStart(3, '0')}`;
});

const detalhesJson = [
    { cliente: "João", total: 45.50, pagamento: "Cartão" },
    { cliente: "Maria", total: 78.90, pagamento: "Dinheiro" },
    { cliente: "Pedro", total: 32.00, pagamento: "Cartão" },
    { cliente: "Ana", total: 120.75, pagamento: "Pix" },
    { cliente: "Luiza", total: 15.30, pagamento: "Cartão" },
    { cliente: "Carlos", total: 89.99, pagamento: "Dinheiro" },
    { cliente: "Fernanda", total: 54.40, pagamento: "Cartão" },
    { cliente: "Roberto", total: 102.50, pagamento: "Pix" },
    { cliente: "Paula", total: 60.10, pagamento: "Cartão" },
    { cliente: "Bruno", total: 25.80, pagamento: "Dinheiro" }
];

// Função para selecionar aleatoriamente um elemento de um array
function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function enviarDados () {
    const selecionados = {
        descricao: getRandomItem(desc),
        horario: getRandomItem(hours),
        dia: getRandomItem(day),
        comandaId: getRandomItem(comandaId),
        detalhesJson: getRandomItem(detalhesJson),
    };
    try {
      const resposta = await axios.post('http://localhost:3000/transicoes/receive', selecionados);
  
      console.log('Dados enviados com sucesso:', resposta.data);
    } catch (erro) {
      console.error('Erro ao enviar os dados:', erro.response ? erro.response.data : erro.message);
    }
  }

cron.schedule('* * * * * *', enviarDados)