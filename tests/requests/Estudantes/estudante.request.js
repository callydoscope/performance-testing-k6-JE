import { check } from 'k6';
import http from 'k6/http';
import env from '../../services/api/routes/index.js';

const url = env.URL_TEST.API;

export default class Estudante {
    constructor() {
        this.params = {
            headers: {
                accept: 'application/json',
                Authorization: '',
            },
        };
    }

    setToken(token) {
        this.params.headers.Authorization = `Bearer ${token}`;
    }

    getEstudante() {
        let response = http.get(`${url}/v3/estudante`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }

    getMatriculas() {
        let response = http.get(`${url}/v3/estudante/matriculas`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }

    getDisciplinas() {
        let response = http.get(`${url}/v3/estudante/matriculas/-1/disciplinas`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }
    
}
