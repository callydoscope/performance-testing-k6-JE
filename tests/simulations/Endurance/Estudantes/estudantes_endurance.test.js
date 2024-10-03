import AuthJWT from '../../../requests/Auth/JWT/authJWT.request.js';
import Estudante from '../../../requests/Estudantes/estudante.request.js';
import { group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export let options = {
    stages: [
        { duration: '10s', target: 5 },    // Começar com menos usuários
        { duration: '1m', target: 5 },     // Manter 5 usuários por 1 minuto
        { duration: '10s', target: 20 },   // Aumentar gradualmente
        { duration: '1m', target: 20 },    // Manter 20 usuários por 1 minuto
        { duration: '10s', target: 5 },    // Reduzir
        { duration: '1m', target: 5 },     // Manter
        { duration: '10s', target: 0 },    // Finalizar
    ],
    thresholds: {
        http_req_duration: ['p(99)<2000'],  // Ajuste o tempo esperado
    },
};


export default function () {
    let authJWT = new AuthJWT();
    let estudante = new Estudante();

    group('Authenticate User and Fetch Data', () => {
        // Obtenção do token JWT
        const jwtToken = authJWT.getJWT('82235336000');
        estudante.setToken(jwtToken);

        group('Estudante Operations', () => {
            estudante.getEstudante();
            estudante.getMatriculas();
            estudante.getDisciplinas();
        });
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/enduranceTesting.html': htmlReport(data),
    };
}
