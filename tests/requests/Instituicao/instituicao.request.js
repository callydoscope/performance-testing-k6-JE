import { check } from 'k6';
import http from 'k6/http';
import env from '../../services/api/routes/index.js';

const urlAdmin = env.URL_TEST.ADMIN;

export default class Instituicao {
    constructor() {
        this.params = {
            headers: {
                'Authorization': '',  // O token será definido aqui
                'Content-Type': 'application/json',
            },
        };
    }

    // Definir o token de autenticação
    setToken(token) {
        this.params.headers.Authorization = `Bearer ${token}`;
    }

    // GET credenciais de instituições com paginação
    getCredenciaisInstituicoes(page, size) {
        let response = http.get(`${urlAdmin}/instituicoes/credenciais?page=${page}&size=${size}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }

    // POST credenciais de instituição
    postCredenciaisInstituicoes(payload) {
        let response = http.post(`${urlAdmin}/instituicoes/credenciais`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
        // console.log(`Response status: ${response.status}`);
        // console.log(`Response body: ${response.body}`);
    }

    // GET instituição com parâmetros
    getInstituicao(identificador, sistemaOrigemId) {
        let response = http.get(`${urlAdmin}/instituicoes/?identificador=${identificador}&sistemaOrigemId=${sistemaOrigemId}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }
    
}
