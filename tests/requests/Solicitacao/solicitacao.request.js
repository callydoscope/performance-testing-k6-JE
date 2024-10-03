import { check } from 'k6';
import http from 'k6/http';
import env from '../../services/api/routes/index.js';

const urlApi = env.URL_TEST.API;

export default class Solicitacao {
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

    // GET solicitação-dados e retornar o maior ID
    getMaxSolicitacaoId(estudanteId) {
        let response = http.get(`${urlApi}/v2/solicitacao-dados?estudanteId=${estudanteId}`, this.params);

        if (response.status !== 200) {
            console.log(`Erro ao buscar solicitações. Status: ${response.status}`);
            return null;
        }

        let solicitacoes = response.json();
        let maxId = null;

        if (solicitacoes && solicitacoes.length > 0) {
            maxId = solicitacoes.reduce((max, solicitacao) => {
                return solicitacao.id > max ? solicitacao.id : max;
            }, solicitacoes[0].id); // Começa com o primeiro `id` no array
        } else {
            console.log('Nenhuma solicitação encontrada.');
        }

        console.log(`Maior ID encontrado: ${maxId}`);
        return maxId;
    }


    // POST criar solicitação de dados
    createSolicitacao(estudanteId, instituicaoId, cursoId, municipioId, situacaoVinculoId, dataAnoInicio, cargaHorariaCurso) {
        const payload = JSON.stringify({
            instituicaoId: instituicaoId,
            cursoId: cursoId,
            municipioId: municipioId,
            situacaoVinculoId: situacaoVinculoId,
            dataAnoInicio: dataAnoInicio,
            cargaHorariaCurso: cargaHorariaCurso,
        });

        let response = http.post(`${urlApi}/v2/solicitacao-dados?estudanteId=${estudanteId}`, payload, this.params);

        // Verificando se a resposta tem status esperado e logando mais detalhes
        console.log(`Response status: ${response.status}`);
        console.log(`Response body: ${response.body}`);

        if (response.status === 201 || response.status === 200) {
            console.log('Solicitação criada com sucesso.');
        } else {
            console.log(`Erro ao criar solicitação de dados. Status: ${response.status}, Body: ${response.body}`);
        }

        check(response, {
            'is status 201 or 200': () => response.status === 201 || response.status === 200,
        });
    }

    // PUT atualizar solicitação de dados
    updateSolicitacao(id, cursoId, municipioId, situacaoVinculoId, dataAnoInicio, turnoId) {
        const payload = JSON.stringify({
            cursoId: cursoId,
            municipioId: municipioId,
            situacaoVinculoId: situacaoVinculoId,
            dataAnoInicio: dataAnoInicio,
            turnoId: turnoId,
        });

        let response = http.put(`${urlApi}/v2/solicitacao-dados/${id}`, payload, this.params);

        // Verificando se a resposta tem status esperado e logando mais detalhes
        console.log(`Response status: ${response.status}`);
        console.log(`Response body: ${response.body}`);

        if (response.status === 200 || response.status === 201) {
            console.log('Solicitação atualizada com sucesso.');
        } else {
            console.log(`Erro ao atualizar solicitação de dados. Status: ${response.status}, Body: ${response.body}`);
        }

        check(response, {
            'is status 200 or 201': () => response.status === 200 || response.status === 201,
        });
    }


    // DELETE solicitação-dados/{id}
    deleteSolicitacao(id) {
        let response = http.del(`${urlApi}/v2/solicitacao-dados/${id}`, null, this.params);
        check(response, {
            'is status 200': () => response.status === 200,
        });
        if (response.status !== 200) {
            console.log(`Error deleting solicitacao dados: ${response.body}`);
        }
    }
    
}
