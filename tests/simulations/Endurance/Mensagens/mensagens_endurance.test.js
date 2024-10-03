import AuthBasic from '../../../requests/Auth/Basic/authBasic.request.js';
import AuthJWT from '../../../requests/Auth/JWT/authJWT.request.js';
import Mensagens from '../../../requests/Mensagens/mensagem.request.js';
import { group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export let options = {
    stages: [
        { duration: '10s', target: 10 },   // Ramp up de 0 a 10 usuários
        { duration: '1m', target: 10 },    // Manter 10 usuários
        { duration: '10s', target: 50 },   // Aumentar para 50 usuários
        { duration: '1m', target: 50 },    // Manter 50 usuários
        { duration: '10s', target: 10 },   // Reduzir para 10 usuários
        { duration: '1m', target: 10 },    // Manter 10 usuários
        { duration: '10s', target: 0 },    // Reduzir para 0 usuários
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],  // 99% das requisições devem ter duração < 1500ms
    },
};

export default function () {
    let authBasic = new AuthBasic();
    let authJWT = new AuthJWT();
    let mensagens = new Mensagens();

    group('Autenticação Basic e Testes de Mensagens no Admin', () => {
        // Autenticar com Basic e obter o token
        const basicToken = authBasic.login('mec', 'mec', 'ADMIN');
        mensagens.setToken(basicToken);  // Usar o token nas requisições de mensagens

        // Testar GET mensagem por ID
        mensagens.getById(-1);

        // Testar GET todas as mensagens com paginação
        mensagens.getAll(1, 10);

        // Criar uma nova mensagem
        mensagens.createMessage('Teste de título', 'Descrição de teste', 2, '2024-11-25');
    });

    group('Autenticação JWT e Testes de Mensagens', () => {
        const jwtToken = authJWT.getJWT('82235336000');

        mensagens.setToken(jwtToken);

        mensagens.getMensagensJWT();
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/mensagensTesting.html': htmlReport(data),
    };
}
