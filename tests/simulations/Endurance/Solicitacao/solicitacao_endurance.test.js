import AuthJWT from '../../../requests/Auth/JWT/authJWT.request.js';
import Solicitacao from '../../../requests/Solicitacao/solicitacao.request.js';
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

// Variável global para manter o controle do ID da solicitação
let solicitacaoId = 1;

export default function () {
    let authJWT = new AuthJWT();
    let solicitacao = new Solicitacao();

    // Grupo de autenticação
    group('Autenticação JWT', () => {
        const jwtToken = authJWT.getJWT('82235336000');
        solicitacao.setToken(jwtToken);  // Configura o token JWT nas requisições
    });

    // Grupo de testes GET para encontrar o maior ID
    let maxId;
    group('Buscar o Maior ID de Solicitação', () => {
        maxId = solicitacao.getMaxSolicitacaoId(-1);  // Encontrar o maior ID
    });

    // Grupo de testes POST
    group('Testes POST Criar Solicitação de Dados', () => {
        solicitacao.createSolicitacao(
            -1,   // estudanteId
            1,    // instituicaoId
            '-1', // cursoId
            '4399', // municipioId
            2,    // situacaoVinculoId
            '2022', // dataAnoInicio
            460    // cargaHorariaCurso
        );
    });

    // Grupo de testes PUT - Atualizar solicitação de dados usando o maior ID
    if (maxId !== null) {
        group('Testes PUT Atualizar Solicitação de Dados', () => {
            solicitacao.updateSolicitacao(
                maxId,         // Usar o maior ID encontrado
                '-1',          // cursoId
                '4399',        // municipioId
                2,             // situacaoVinculoId
                2024,          // dataAnoInicio
                null           // turnoId
            );
        });
    } else {
        console.log('Nenhuma solicitação foi encontrada para atualizar.');
    }

    // Grupo de testes DELETE - Usar o maior ID encontrado
    // if (maxId !== null) {
    //     group('Testes DELETE Solicitação de Dados', () => {
    //         solicitacao.deleteSolicitacao(maxId);  // Testando DELETE na solicitação com o maior ID
    //         console.log(`Solicitação com ID ${maxId} excluída.`);
    //     });
    // } else {
    //     console.log('Nenhuma solicitação foi encontrada para excluir.');
    // }

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/solicitacaoTesting.html': htmlReport(data),
    };
}
