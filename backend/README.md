# App Abastecimento

Sistema de controle de abastecimento de veículos com autenticação, gerenciamento de veículos e relatórios.

## Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL
  - Sequelize (ORM)
  - JWT para autenticação

- **Frontend:**
  - HTML5
  - Tailwind CSS
  - JavaScript

## Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd app-abastecimento
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme seu ambiente

4. Configure o banco de dados:
- Crie um banco de dados PostgreSQL
- Execute as migrações:
```bash
npx sequelize-cli db:migrate
```

5. (Opcional) Execute os seeders para dados iniciais:
```bash
npx sequelize-cli db:seed:all
```

## Executando o Projeto

1. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

2. Acesse a aplicação:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## Estrutura do Projeto

```
/app-abastecimento
|-- /src
|   |-- /config         # Configurações (banco de dados, etc)
|   |-- /controllers    # Controladores da aplicação
|   |-- /database       # Migrações e seeders
|   |-- /middlewares    # Middlewares (auth, etc)
|   |-- /models         # Modelos do Sequelize
|   |-- /routes         # Rotas da API
|   |-- /services       # Serviços da aplicação
|   |-- /utils          # Funções utilitárias
|   `-- server.js       # Arquivo principal
|-- /public             # Arquivos estáticos do frontend
|-- .env               # Variáveis de ambiente
|-- package.json
`-- README.md
```

## Funcionalidades

- [x] Autenticação de usuários
- [x] Gerenciamento de veículos
- [x] Registro de abastecimentos
- [x] Cálculo de consumo médio
- [ ] Relatórios e gráficos
- [ ] Painel administrativo
- [ ] Sistema de assinaturas

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 