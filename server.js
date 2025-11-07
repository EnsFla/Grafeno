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

//ROTA FEITA EM AULA
app.get('/', (req, res) => {
    counter.inc();
    //MUDEI PARA CARREGAR O INDEX.HTML
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

app.listen(3123, () => {
    console.log('App rodando na porta 3123');
});