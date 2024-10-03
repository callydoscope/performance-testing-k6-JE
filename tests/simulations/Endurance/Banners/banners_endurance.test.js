import AuthBasic from '../../../requests/Auth/Basic/authBasic.request.js';
import Banners from '../../../requests/Banners/banners.request.js';
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
    let banners = new Banners();

    // Grupo de autenticação Basic
    group('Autenticação Basic para Admin', () => {
        const token = authBasic.login('mec', 'mec', 'ADMIN');
        if (token) {
            banners.setToken(token);  // Configura o token nas requisições
        } else {
            console.log('Falha no login. Encerrando teste.');
            return;
        }
    });

    // Grupo para GET banners com paginação e captura do maior ID
    group('GET Banners com Paginação e Captura do Maior ID', () => {
        banners.getBanners(20);  // 20 banners por página
    });

    // Grupo para POST criar banner com upload de imagem
    group('POST Criar Banner', () => {
        banners.postBanner('teste 1', '', 'https://www.youtube.com/watch?v=6AeOjLPzLus', "1");
    });

    // Grupo para PUT banner com upload de imagem usando o maior ID capturado
    group('PUT Banner com Upload de Imagem', () => {
        banners.putBanner(
            banners.maxBannerId,               // Usar o maior ID capturado
            'Banner Editado',                  // Novo título
            '',                                // Caminho da imagem já carregada
            'https://github.com/orgs/laboratoriobridge/projects/46/views/1',  // Nova URL
            '2029-05-21',                      // Data de validade
            "2"                                // Situação do banner
        );
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/bannersTesting.html': htmlReport(data),
    };
}
