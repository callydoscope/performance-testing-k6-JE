# Performance Testing - K6 - JE

Este repositório contém um conjunto de testes de carga, stress e resistência usando o K6, uma ferramenta moderna para realizar testes de performance em APIs e sistemas distribuídos. O objetivo principal é garantir a robustez e eficiência de diversos endpoints do Jornada do Estudante, simulando diferentes cenários de uso e carga.

## Visão Geral

O projeto utiliza **K6** como a principal ferramenta de teste para verificar o comportamento de APIs sob diferentes tipos de carga. Os testes incluem cenários de **endurance**, **load** e **stress**, abrangendo os principais endpoints de autenticação, estudantes, mensagens, solicitação de dados, recebimento, banners e instituições.

Este repositório foi estruturado de maneira a ser flexível, escalável e modular, permitindo que cada conjunto de testes possa ser facilmente configurado e executado de forma independente, conforme a necessidade do projeto.

## Estrutura do Projeto

```
├── dist/                         # Arquivos compilados prontos para execução de testes
├── tests/                        # Contém os testes de simulação K6
│   ├── images/                   # Imagens usadas em testes, como upload de banners
│   ├── requests/                 # Requisições encapsuladas em classes
│   │   ├── Auth/                 # Classes para autenticação
│   │   ├── Estudantes/           # Requisições relacionadas a estudantes
│   │   ├── Banners/              # Requisições de banners com upload de imagens
│   │   └── ...                   # Outras entidades
│   └── simulations/              # Scripts de simulação para diferentes tipos de testes
│       ├── Endurance/            # Testes de resistência
│       ├── Load/                 # Testes de carga
│       └── Stress/               # Testes de estresse
├── esbuild.config.js             # Configuração do esbuild para gerar os arquivos de teste
├── package.json                  # Gerenciamento de dependências e scripts de execução
└── README.md                     # Documentação do projeto
```

## Requisitos

- Node.js >= 14.x
- Yarn ou NPM
- K6 instalado globalmente
- Esbuild para empacotamento dos scripts

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/callyca/performance-testing-k6-JE.git
   ```

2. Acesse o diretório do projeto:
   ```bash
   cd performance-testing-k6-JE
   ```

3. Instale as dependências:
   ```bash
   yarn install
   ```

4. Certifique-se de ter o **K6** instalado:
   ```bash
   brew install k6   # Para macOS
   choco install k6  # Para Windows
   ```

## Scripts de Teste

Os scripts de teste foram organizados para facilitar a execução de testes de diferentes cenários, como carga, estresse e resistência. Utilize os seguintes comandos para rodar os testes:

### Teste de Resistência

Este teste simula o uso prolongado do sistema sob uma carga moderada para identificar falhas a longo prazo.

```bash
yarn enduranceTest
```

### Teste de Carga

Este teste verifica como o sistema lida com uma carga média-alta e mede o tempo de resposta em condições normais.

```bash
yarn loadTest
```

### Teste de Estresse

O teste de estresse simula uma carga extrema para verificar os limites do sistema e como ele se comporta quando sobrecarregado.

```bash
yarn stressTest
```

## Como Executar Testes Específicos

O projeto suporta a execução de testes específicos com base na seleção de scripts. Para escolher qual teste rodar, você pode utilizar a variável `TEST_TYPE` para especificar o tipo de teste a ser executado. Veja os exemplos abaixo:

### Testes de Endurance

Para rodar um teste específico de endurance, como o de estudantes ou mensagens, utilize os seguintes comandos:

```bash
TEST_TYPE=estudantes yarn enduranceTest
TEST_TYPE=mensagens yarn enduranceTest
TEST_TYPE=solicitacao yarn enduranceTest
TEST_TYPE=recebimento yarn enduranceTest
TEST_TYPE=banners yarn enduranceTest
TEST_TYPE=instituicao yarn enduranceTest
```

### Testes de Carga e Estresse

Para rodar os testes de carga ou estresse, você pode utilizar os comandos a seguir:

```bash
yarn loadTest -- rest
yarn stressTest -- rest
```

## Desenvolvimento

### Compilando os Testes

O **esbuild** é utilizado para gerar o código que será executado nos testes. Utilize o seguinte comando para compilar os testes:

```bash
yarn build
```

Caso esteja desenvolvendo e queira monitorar mudanças nos arquivos, utilize:

```bash
yarn watch
```

### Estrutura dos Arquivos de Teste

Cada teste está encapsulado dentro de classes para manter a organização e facilitar o reuso de código. O módulo de autenticação, por exemplo, pode ser utilizado em diferentes tipos de testes de APIs.

Os testes são divididos em grupos lógicos para cobrir diferentes endpoints e cenários. Por exemplo:

- **Estudantes:** Testa endpoints relacionados a estudantes (cadastro, consulta, etc).
- **Banners:** Foca em testar funcionalidades de banners, como criação, upload e atualização.
- **Solicitação de Dados:** Testa a criação, atualização e exclusão de solicitações de dados.

## Relatórios

Os testes geram relatórios detalhados ao final da execução. Por padrão, os relatórios são gerados no formato JSON e HTML dentro do diretório `tests/reports/`. Para visualizar os relatórios, utilize:

```bash
open tests/reports/<relatório-html>.html
```
