const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();

//COLETA AS METRICAS PADROES
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

//METRICA PERSONALIZADA FEITA EM AULA
const counter = new client.Counter({
  name: 'app_requests_total',
  help: 'Contador de requisições recebidas'
});

//METRICA DE CLIQUE NO BOTÃO
const totalCliques = new client.Counter({
    name: 'clicamentos_totais',
    help: 'Contador de cliques no botão de teste'
});

// --- INÍCIO DA CORREÇÃO ---
// A rota principal agora aponta para o arquivo correto
app.get('/', (req, res) => {
    counter.inc();
    // CORRIGIDO: Removido o 'public' do caminho
    res.sendFile(path.join(__dirname, 'index.html'));
});
// --- FIM DA CORREÇÃO ---

//ROTA FEITA EM AULA
app.get('/metrics', async (req, res) => {
    res.set('content-type', client.register.contentType);
    res.end(await client.register.metrics());
});

//ROTA PARA RASTREAR CLIQUES
app.post('/contando', (req, res) => {
    totalCliques.inc();
    res.status(200).send('Clicado');
});

// Certifique-se de que a porta aqui é a mesma do seu Dockerfile (3123)
app.listen(3123, () => {
    console.log('Servidor rodando na porta 3123');
});