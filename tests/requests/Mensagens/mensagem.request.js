import { check } from 'k6';
import http from 'k6/http';
import env from '../../services/api/routes/index.js';

const urlAdmin = env.URL_TEST.ADMIN;
const urlApi = env.URL_TEST.API;

export default class Mensagens {
    constructor() {
        this.params = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: '',
            },
        };
    }

    // Define o token de autenticação para as requisições
    setToken(token) {
        this.params.headers.Authorization = `Bearer ${token}`;
    }

    // GET mensagens/{ID} - Admin
    getById(id) {
        let response = http.get(`${urlAdmin}/mensagens/${id}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
            'mensagem retornada corretamente': () => response.json().id === id,
        });
        if (response.status !== 200) {
            console.log(`Error fetching mensagem by ID: ${response.body}`);
        }
    }

    // GET mensagens com paginação - Admin
    getAll(page, size) {
        let response = http.get(`${urlAdmin}/mensagens?page=${page}&size=${size}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
            'mensagens retornadas corretamente': () => response.json().content && response.json().content.length > 0,
        });
        if (response.status !== 200) {
            console.log(`Error fetching mensagens: ${response.body}`);
        }
    }

    // POST criar mensagem - Admin
    createMessage(titulo, descricao, situacaoMensagem, dataValidade) {
        const payload = JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            situacaoMensagem: situacaoMensagem,
            dataValidade: dataValidade,
        });

        let response = http.post(`${urlAdmin}/mensagens`, payload, this.params);

        console.log(`Response status: ${response.status}`);
        console.log(`Response body: ${response.body}`);

        if (response.body && response.headers['Content-Type'].includes('application/json')) {
            let responseBody = response.json();
            check(response, {
                'is status 200': () => response.status === 200,
                'mensagem criada': () => responseBody.id !== null,
            });
        } else {
            console.log(`Unexpected response: ${response.body}`);
        }
    }

    // GET mensagens com JWT
    getMensagensJWT() {
        let response = http.get(`${urlApi}/v1/mensagens`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
            'mensagens retornadas corretamente': () => response.json().length > 0,
        });
        if (response.status !== 200) {
            console.log(`Error fetching mensagens with JWT: ${response.body}`);
        }
    }
    
}
