import AuthRecebimento from '../../../requests/Auth/Recebimento/authRecebimento.request.js';
import Recebimento from '../../../requests/Recebimento/recebimento.request.js';
import { group, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export let options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],
    },
};

export default function () {
    let authRecebimento = new AuthRecebimento();
    let recebimento = new Recebimento();

    // Grupo de autenticação para Recebimento
    group('Autenticação no Recebimento', () => {
        const accessToken = authRecebimento.login('bridge', 'bridge');
        if (accessToken) {
            recebimento.setToken(accessToken);  // Configura o token nas requisições
        } else {
            console.log('Falha no login. Encerrando teste.');
            return;
        }
    });

    // Grupo para envio de disciplinas
    group('POST Recebimento de Disciplinas', () => {
        recebimento.postDisciplinas([{
            "cpfEstudante": "82235336000",
            "emecCurso": "00000001",
            "numeroMatricula": "254544548412216123654789",
            "identificadorCursoJE": "-1",
            "anoMesIngresso": "2020-01",
            "disciplinas": [{
                "idDisciplinaCursoInstituicao": "ALG123",
                "nomeDisciplina": "Algoritmos II",
                "cargaHoraria": 60,
                "periodo": 1,
                "componenteObrigatorio": "0",
                "resultado": 1,
                "matrizCurso": 1,
                "nota": "10.0"
            }]
        }]);
    });

    // Grupo para envio de matrículas
    group('POST Recebimento de Matrículas', () => {
        recebimento.postMatriculas([{
            "nomeEstudante": "João Guedes",
            "cpfEstudante": "82235336000",
            "dataNascimentoEstudante": "1999-05-15",
            "identificadorInstituicao": "163",
            "identificadorCurso": "1576478",
            "sistemaOrigem": 1,
            "indiceAproveitamentoEstudante": 9.98,
            "indiceAproveitamentoMedio": 9.989,
            "numeroMatricula": "0000002",
            "situacaoVinculo": 6,
            "anoMesIngresso": "2020-07",
            "anoMesConclusao": "2023-05",
            "posicionamentoCurso": 5,
            "cargaHorariaIntegralizada": 1000,
            "turno": 2,
            "municipioCurso": "4205407",
            "modalidadeEnsino": 1,
            "urlDiplomaXml": "https://github.com/orgs/laboratoriobridge/projects/46/views/1?pane=issue&itemId=27601691",
            "urlDiplomaPdf": "https://dfd.com",
            "nomeCivilEstudante": "João Guedes",
            "identificadorCursoJE": -1
        }]);
    });

    // Grupo para envio de cursos
    group('PUT Recebimento de Cursos', () => {
        recebimento.putCursos([{
            "emecCurso": "00000001",
            "nomeCurso": "Ciência da Computação",
            "etapaEnsino": "75",
            "identificadorCursoJE": "-1",
            "nivelEnsino": "21"
        }]);
    });

    // Grupo para PUT de instituição
    group('PUT Recebimento de Instituição', () => {
        recebimento.putInstituicao({
            "emecInstituicao": "00000001",
            "nomeInstituicao": "Universidade Federal de Santa Catarina",
            "cnpjInstituicao": "56999211000134",
            "emailInstituicao": "ufsc@test.com.br",
            "numeroTelefoneInstituicao": "4888887777"
        });
    });

    // Grupo para busca de matrículas inconsistentes
    group('GET Matrículas Inconsistentes', () => {
        recebimento.getMatriculasInconsistentes();
    });

    // Grupo para envio de responsáveis
    group('POST Recebimento de Responsáveis', () => {
        recebimento.postResponsaveis([{
            "cpfEstudante": "82235336000",
            "responsaveis": [{
                "cpfResponsavel": "59218070525"
            }]
        }]);
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        'tests/reports/summary.json': JSON.stringify(data),
        'tests/reports/recebimentoTesting.html': htmlReport(data),
    };
}
