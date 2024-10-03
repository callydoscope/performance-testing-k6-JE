import { check } from 'k6';
import http from 'k6/http';
import env from '../../../services/api/routes/index.js';

const url = env.URL_TEST.API;

export default class AuthJWT {
    constructor() {
        this.params = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
    }

    getJWT(cpf) {
        let response = http.get(`${url}/public/jwt/${cpf}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
            'response contains token': () => response.json('jwt') !== '',
            'token has correct format': () => {
                const token = response.json('jwt');
                const isValidFormat = token && token.split('.').length === 3;
                if (!isValidFormat) {
                    console.log(`Invalid token format: ${token}`);
                }
                return isValidFormat;
            },
        });
        if (response.status !== 200) {
            console.log(`Error: Status ${response.status}, Response: ${response.body}`);
        }
        return response.json('jwt');
    }

}
