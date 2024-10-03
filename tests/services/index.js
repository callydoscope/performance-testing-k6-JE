import env from './api/routes';

export default class Router {
    static getBaseUrl() {
        switch (process.env.NODE_ENV) {
            case 'development':
                return env.URL_TEST.API;  // URL para ambiente de desenvolvimento
            case 'admin':
                return env.URL_TEST.ADMIN; // URL para endpoints administrativos (LDAP, etc.)
            case 'production':
                return process.env.API_PRODUCTION_URL || env.URL_TEST.API;
            default:
                console.error('URL or environment not defined');
                return null;  // Retorna null ou lança erro para garantir o tratamento correto
        }
    }
}
