const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Carrega as variáveis de ambiente

const SPORTS_API_KEY = process.env.SPORTS_API_KEY;
const SPORTS_API_HOST = process.env.SPORTS_API_HOST;

async function getPredictions(dateFrom, dateTo) {
    try {
        const response = await axios.get(`https://${SPORTS_API_HOST}/bm/predictions/list/${encodeURIComponent(dateFrom)}/${encodeURIComponent(dateTo)}`, {
            headers: {
                'x-rapidapi-host': SPORTS_API_HOST,
                'x-rapidapi-key': SPORTS_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao chamar a API de esportes:', error);
        throw new Error(`Erro ao chamar API de esportes: ${error.message}`);
    }
}

module.exports = { getPredictions };
