import { check } from 'k6';
import http from 'k6/http';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import env from '../../services/api/routes/index.js';

const urlAdmin = env.URL_TEST.ADMIN;
const imageFile = open('../tests/images/banner/tempBanner.png', 'b');  // Carrega a imagem em binário

export default class Banners {
    constructor() {
        this.params = {
            headers: {
                Authorization: '',  // O token será definido aqui
            },
        };
        this.maxBannerId = 0;  // Variável para armazenar o maior ID de banner
    }

    // Definir o token de autenticação
    setToken(token) {
        this.params.headers.Authorization = `Bearer ${token}`;
    }

    // GET banners com paginação e captura o maior ID em todas as páginas
    getBanners(pageSize) {
        let currentPage = 0;
        let totalPages = 1;

        while (currentPage < totalPages) {
            let response = http.get(`${urlAdmin}/banners?page=${currentPage}&size=${pageSize}`, this.params);

            check(response, {
                'is status 200': () => response.status === 200,
            });

            const jsonResponse = response.json();
            if (jsonResponse && jsonResponse.content) {
                const banners = jsonResponse.content;

                // Encontra o maior ID de banner
                banners.forEach(banner => {
                    if (banner.id > this.maxBannerId) {
                        this.maxBannerId = banner.id;  // Atualiza com o maior ID encontrado
                    }
                });

                // Atualiza a paginação
                totalPages = jsonResponse.totalPages;
                currentPage++;
            } else {
                console.log('Erro ao processar resposta de banners.');
                break;
            }
        }

        console.log(`Maior ID de banner encontrado: ${this.maxBannerId}`);
    }

    // GET banner por ID
    getBannerById(id) {
        let response = http.get(`${urlAdmin}/banners/${id}`, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
    }

    // POST criar um novo banner com upload de imagem
    postBanner(titulo, filePath, url, situacaoBanner) {
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('file', {
            data: imageFile,  // Usar a imagem já carregada
            filename: 'tempBanner.png',
            content_type: 'image/png',  // Definir o tipo como PNG
        });
        formData.append('url', url);
        formData.append('situacaoBanner', situacaoBanner);

        let response = http.post(`${urlAdmin}/banners`, formData.body(), {
            headers: {
                'Authorization': this.params.headers.Authorization,
                'Content-Type': `multipart/form-data; boundary=${formData.boundary}`,  // Boundary gerado pelo FormData
            },
        });

        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }

    // PUT para atualizar um banner
    putBanner(id, titulo, filePath, url, dataValidade, situacaoBanner) {
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('file', {
            data: imageFile,  // Usar a imagem já carregada
            filename: 'tempBanner.png',
            content_type: 'image/png',  // Definir o tipo como PNG
        });
        formData.append('url', url);
        formData.append('dataValidade', dataValidade);
        formData.append('situacaoBanner', situacaoBanner);

        let response = http.put(`${urlAdmin}/banners/${id}`, formData.body(), {
            headers: {
                'Authorization': this.params.headers.Authorization,
                'Content-Type': `multipart/form-data; boundary=${formData.boundary}`,  // Boundary gerado pelo FormData
            },
        });

        check(response, {
            'is status 200': () => response.status === 200,
        });
    }
    
}
