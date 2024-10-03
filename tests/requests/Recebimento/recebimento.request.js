import { check } from 'k6';
import http from 'k6/http';
import env from '../../services/api/routes/index.js';

const urlRecebimento = env.URL_TEST.RECEBIMENTO;

export default class Recebimento {
    constructor() {
        this.params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: '',  // O token será definido aqui
            },
        };
    }

    // Definir o token de autenticação
    setToken(token) {
        this.params.headers.Authorization = `Bearer ${token}`;
    }

    // POST disciplinas
    postDisciplinas(payload) {
        let response = http.post(`${urlRecebimento}/v4/recebimento/disciplinas`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }

    // POST matriculas
    postMatriculas(payload) {
        let response = http.post(`${urlRecebimento}/v4/recebimento/matriculas`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }

    // PUT cursos
    putCursos(payload) {
        let response = http.put(`${urlRecebimento}/v4/recebimento/cursos`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }

    // PUT instituição
    putInstituicao(payload) {
        let response = http.put(`${urlRecebimento}/v4/recebimento/instituicao`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }

    // GET matriculas inconsistentes
    getMatriculasInconsistentes() {
        let response = http.get(`${urlRecebimento}/v4/recebimento/matriculas-inconsistentes`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }

    // POST responsáveis
    postResponsaveis(payload) {
        let response = http.post(`${urlRecebimento}/v4/recebimento/responsaveis`, JSON.stringify(payload), this.params);
        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }
}
