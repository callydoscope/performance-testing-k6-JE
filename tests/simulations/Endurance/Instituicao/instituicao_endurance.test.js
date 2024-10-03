import AuthBasic from '../../../requests/Auth/Basic/authBasic.request.js';
import Instituicao from '../../../requests/Instituicao/instituicao.request.js';
import { group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],
    },
};

export default function () {
    let authBasic = new AuthBasic();
    let instituicao = new Instituicao();

    // Grupo de autenticação Basic
    group('Autenticação Basic para Admin', () => {
        const token = authBasic.login('mec', 'mec', 'ADMIN');
        if (token) {
            instituicao.setToken(token);  // Configura o token nas requisições
        } else {
            console.log('Falha no login. Encerrando teste.');
            return;
        }
    });

    // Grupo para GET credenciais de instituições
    group('GET Credenciais Instituições', () => {
        instituicao.getCredenciaisInstituicoes(0, 20);
    });

    // Grupo para POST credenciais de instituições
    group('POST Credenciais Instituições', () => {
        instituicao.postCredenciaisInstituicoes({
            "instituicaoId": -1,
            "cpfResponsavel": "13918920038",
            "nomeResponsavel": "silva test test",
            "telefoneResponsavel": "85991992956",
            "emailResponsavel": "gededan179@migonom.com"
        });
    });

    // Grupo para GET instituição por identificador e sistemaOrigemId
    group('GET Instituição', () => {
        instituicao.getInstituicao(-1, 1);
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/instituicaoTesting.html': htmlReport(data),
    };
}
