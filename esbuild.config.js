const esbuild = require('esbuild');
const { globPlugin } = require('esbuild-plugin-glob');

const args = process.argv.slice(2);
const testType = args[0] || 'load';

// Mapeia os testes para seus respectivos arquivos
const testMap = {
  'estudantes': 'tests/simulations/Endurance/Estudantes/estudantes_endurance.test.js',
  'mensagens': 'tests/simulations/Endurance/Mensagens/mensagens_endurance.test.js',
  'solicitacao': 'tests/simulations/Endurance/Solicitacao/solicitacao_endurance.test.js',
  'recebimento': 'tests/simulations/Endurance/Recebimento/recebimento_endurance.test.js',
  'instituicao': 'tests/simulations/Endurance/Instituicao/instituicao_endurance.test.js',
  'banners': 'tests/simulations/Endurance/Banners/banners_endurance.test.js',
  'authBasic': 'tests/simulations/Endurance/Basic/authBasic_endurance.test.js',
  'load': 'tests/simulations/rest/load.test.js',
  'stress': 'tests/simulations/rest/stress.test.js',
};

// Seleciona o arquivo de teste com base no argumento
const selectedTest = testMap[testType] || testMap['load'];  // Se não houver argumento, usa o 'load'

// Função para construir com esbuild
async function buildWithEsbuild() {
  try {
    await esbuild.build({
      entryPoints: [selectedTest],  // Usa o arquivo de teste selecionado
      bundle: true,
      outdir: 'dist',
      platform: 'node',
      sourcemap: true,
      plugins: [globPlugin()],
      target: 'esnext',
      format: 'cjs',
      external: ['k6'],
      minify: process.env.NODE_ENV === 'production',
    });
    console.log(`Teste selecionado: ${selectedTest}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Função para assistir mudanças nos arquivos e reconstruir
async function watchFiles() {
  // Inicializa a construção inicial
  await buildWithEsbuild();

  // Assiste por mudanças nos arquivos e reconstrói quando necessário
  const chokidar = require('chokidar');
  const watcher = chokidar.watch(['tests/**/*.js']);

  watcher.on('change', async () => {
    console.log('Arquivos modificados. Reconstruindo...');
    await buildWithEsbuild();
  });
}

// Verifica se está em modo de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

// Executa o modo de watch se estiver em desenvolvimento
if (isDevelopment) {
  watchFiles();
} else {
  buildWithEsbuild();
}
