
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const uri = process.env.MONGODB_URI;

app.use(express.static('public'));

// Função para conectar com MongoDB Atlas
async function conectarBanco() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado ao banco MongoDB Atlas com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar no MongoDB Atlas:', erro);
    process.exit(1);
  }
}



// Definição do esquema e modelo Mongoose para roupas
const roupaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
});



const Roupa = mongoose.model('Roupa', roupaSchema);



// Middleware
app.use(cors());
app.use(express.json());



// Conectar ao banco
await conectarBanco();


// Rotas
app.get('/api/roupas', async (req, res) => {
  try {
    const roupas = await Roupa.find();
    res.json(roupas);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao buscar roupas', erro: erro.message });
  }
});


app.post('/api/roupas', async (req, res) => {
  const { nome, descricao, preco, imagemUrl } = req.body;
  if (!nome || !descricao || !preco || !imagemUrl) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }
  try {
    const novaRoupa = new Roupa({ nome, descricao, preco, imagemUrl });
    const roupaSalva = await novaRoupa.save();
    res.status(201).json(roupaSalva);
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao salvar roupa', erro: erro.message });
  }
});

const PORTA = process.env.PORTA || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});


