# App Abastecimento

## Proposta do Projeto

O App Abastecimento é uma solução web responsiva para controle de abastecimentos, consumo e custos de veículos. O objetivo é facilitar o acompanhamento do consumo médio, gastos e localização de postos próximos, proporcionando ao usuário uma experiência moderna, intuitiva e visualmente agradável.

## Funcionalidades Principais
- Cadastro e gerenciamento de veículos
- Registro de abastecimentos com cálculo automático de consumo
- Visualização do consumo médio de cada veículo em cards individuais
- Relatórios de gastos e abastecimentos
- Localização de postos próximos via Google Maps
- Sugestão de postos e cálculo de rotas
- Interface mobile-first com navegação inferior (BottomNav)

## Cores Utilizadas
O design do app utiliza uma paleta moderna e vibrante:

- **Roxo Primário:** #7b5fff
- **Azul Secundário:** #3c8ce7
- **Amarelo Destaque:** #f7c948
- **Cinza Escuro:** #2d2357
- **Cinza Claro:** #f5f6fa
- **Branco:** #fff

Exemplo de gradientes:
- `linear-gradient(135deg, #7b5fff 60%, #f7c948 100%)`
- `linear-gradient(135deg, #2d2357 60%, #7b5fff 100%)`

## Tecnologias Utilizadas
- **Frontend:** Vue.js 3, PrimeVue, Axios, Google Maps API
- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Autenticação:** JWT
- **Estilização:** CSS3, PrimeIcons

## Estrutura de Navegação
- **Home:** Visão geral dos veículos, consumo médio, gastos e abastecimentos
- **Veículos:** Cadastro, edição e exclusão de veículos
- **Abastecimentos:** Registro e histórico de abastecimentos
- **Relatórios:** Gráficos e análises de consumo e gastos
- **Postos:** Mapa com postos próximos e traçado de rotas
- **Percurso:** Cálculo de custo de viagem com base no consumo do veículo

## Como rodar o projeto
1. Clone o repositório
2. Instale as dependências em `backend` e `frontend`
3. Configure o banco de dados PostgreSQL e as variáveis de ambiente
4. Execute as migrações com Sequelize
5. Inicie o backend (`npm run dev` na pasta backend)
6. Inicie o frontend (`npm run dev` na pasta frontend)

## Experiência Visual
- Interface responsiva, otimizada para mobile
- Navegação inferior fixa (BottomNav)
- Cards com informações destacadas e ícones intuitivos
- Paleta de cores moderna e agradável

## Licença
Este projeto é open-source e está sob a licença MIT. 