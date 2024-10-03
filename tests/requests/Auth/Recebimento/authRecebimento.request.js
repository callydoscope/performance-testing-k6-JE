import { check } from 'k6';
import http from 'k6/http';
import env from '../../../services/api/routes/index.js';

const urlRecebimento = env.URL_TEST.RECEBIMENTO;

export default class AuthRecebimento {
    constructor() {
        this.params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    // Login e obtenção do AccessToken
    login(usuario, senha) {
        const payload = JSON.stringify({
            usuario: usuario,
            senha: senha,
        });

        let response = http.post(`${urlRecebimento}/recebimento/auth/login`, payload, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
            'response contains accessToken': () => response.json('accessToken') !== null,
        });

        if (response.status === 200) {
            return response.json('accessToken');
        } else {
            console.log(`Erro ao fazer login: ${response.status}, Body: ${response.body}`);
            return null;
        }
    }
    
}
