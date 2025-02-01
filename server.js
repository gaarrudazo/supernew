const express = require('express');
const cors = require('cors');
const firebase = require('./firebase'); // Certifique-se que o firebase.js está configurado corretamente
const sportsApi = require('./sportsApi');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota para pegar as previsões de esportes
app.get('/api/sports', async (req, res) => {
    const { dateFrom, dateTo } = req.query;

    console.log('Requisição para esportes recebida com:', { dateFrom, dateTo });

    if (!dateFrom || !dateTo) {
        return res.status(400).json({ error: 'Data inicial e final são necessárias.' });
    }

    try {
        const predictions = await sportsApi.getPredictions(dateFrom, dateTo);
        console.log('Previsões recebidas:', predictions);
        res.json(predictions);
    } catch (error) {
        console.error('Erro ao chamar API de esportes:', error);
        res.status(500).json({ error: 'Erro ao buscar previsões: ' + error.message });
    }
});

// Rota para buscar dados do Firebase (com userId)
app.get('/api/firebase', async (req, res) => {
    const { userId } = req.query;

    // Verifica se o 'userId' foi passado
    if (!userId) {
        return res.status(400).json({ error: "O parâmetro 'userId' é obrigatório." });
    }

    try {
        // Buscando o usuário no Firestore com o userId
        const userDoc = await firebase.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Retorna os dados do usuário encontrado
        res.json({ data: userDoc.data() });
    } catch (error) {
        console.error("Erro ao acessar o Firestore:", error);
        res.status(500).json({ error: "Erro ao acessar o Firestore." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


