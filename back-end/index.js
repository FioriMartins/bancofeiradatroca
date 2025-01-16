require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/mysql/database');
const corsOptions = require('./config/corsOptions');
const authRoutes = require('./routes/authRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const comandasRoutes = require('./routes/comandasRoutes')
const logRoutes = require('./routes/logRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/metrics', metricsRoutes);
app.use('/categories', categoryRoutes);
app.use('/stock', productRoutes);
app.use('/comandas', comandasRoutes)
app.use('/log', logRoutes)

// Testar conexão com o banco de dados
sequelize.authenticate()
  .then(() => console.log('Banco conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));