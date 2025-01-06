const { doc, updateDoc, Timestamp } = require("firebase/firestore");
const { db } = require("../config/firebase/connect");
// Função para adicionar o campo 'detalhes' aos documentos existentes
async function adicionarCampoDetalhes() {
  for (let i = 1; i <= 550; i++) {
    // Gerar o ID no formato F001, F002, ..., F400
    const id = `F${i.toString().padStart(3, '0')}`;

    // Referência para o documento com o ID gerado
    const docRef = doc(db, "comandas", id);

    // Dados a serem atualizados (campo 'detalhes' como Map vazio)
    const dadosAtualizados = {
      ultima_atualizacao: Timestamp.fromDate(new Date()),  // Campo 'detalhes' do tipo Map vazio
    };

    try {
      // Atualiza o documento no Firestore
      await updateDoc(docRef, dadosAtualizados);
      console.log(`Campo 'detalhes' adicionado ao documento com ID ${id}.`);
    } catch (err) {
      console.error(`Erro ao atualizar o documento com ID ${id}:`, err);
    }
  }
}

// Chama a função para adicionar o campo 'detalhes' em todos os documentos
adicionarCampoDetalhes()
  .then(() => console.log("Campo 'detalhes' adicionado a todos os documentos."))
  .catch((err) => console.error("Erro ao adicionar o campo 'detalhes':", err));
