import AuthBasic from '../../../requests/Auth/Basic/authBasic.request.js';
import { group, sleep } from 'k6';
import { check } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '10s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '10s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],  // 99% das requisições devem ter duração menor que 1500ms
    },
};

export default function () {
    let authBasic = new AuthBasic();

    // Grupo para teste de login básico
    group('Autenticação Basic', () => {
        const token = authBasic.login('mec', 'mec', 'ADMIN');  // Credenciais de teste
        check(token, {
            'token should not be empty': (t) => t && t.length > 0,  // Verifica se o token foi obtido
        });

        // Valida que o token foi obtido corretamente e pode ser usado para requisições subsequentes
        if (!token) {
            console.log('Autenticação falhou. Encerrando o teste.');
            return;
        }
    });
    
    sleep(1);  // Pausa de 1 segundo entre os grupos de testes
}
