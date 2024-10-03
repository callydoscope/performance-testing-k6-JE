import { check } from 'k6';
import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import env from '../../../services/api/routes/index.js';

const url = env.URL_TEST.ADMIN;

export default class AuthBasic {
    constructor() {
        this.params = {
            headers: {
                // A header Content-Type será automaticamente definida como multipart/form-data
            },
        };
        this.token = '';
    }

    login(username, password, role) {
        // Usando FormData para enviar os campos como multipart/form-data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('papel', role);

        let response = http.post(`${url}/ldap/login`, formData.body(), {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData.boundary}`,
            },
        });

        // console.log(`Login response status: ${response.status}`);
        // console.log(`Login response body: ${response.body}`);
        // console.log(`Login response headers: ${JSON.stringify(response.headers)}`);

        check(response, {
            'is status 200': () => response.status === 200,
        });

        const cookies = response.headers['Set-Cookie'];
        if (cookies) {
            const bearerCookie = cookies.match(/Bearer=([^;]+);/);
            if (bearerCookie && bearerCookie[1]) {
                this.token = bearerCookie[1];
                console.log(`Bearer Token: ${this.token}`);
            } else {
                console.log('Bearer token not found in cookies');
            }
        } else {
            console.log('Set-Cookie header not found in the response');
        }

        return this.token;
    }

    getToken() {
        return this.token;
    }
}
