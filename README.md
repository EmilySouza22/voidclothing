# Void Clothing

![React](https://img.shields.io/badge/React-DBDBDB?style=for-the-badge&logo=react&logoColor=000000)
![Vite](https://img.shields.io/badge/Vite-B8B8B8?style=for-the-badge&logo=vite&logoColor=000000)
![Axios](https://img.shields.io/badge/Axios-949494?style=for-the-badge&logo=axios&logoColor=000000)
![Node.js](https://img.shields.io/badge/Node.js-707070?style=for-the-badge&logo=nodedotjs&logoColor=FFFFFF)
![Express](https://img.shields.io/badge/Express-4D4D4D?style=for-the-badge&logo=express&logoColor=FFFFFF)
![MySQL](https://img.shields.io/badge/MySQL-292929?style=for-the-badge&logo=mysql&logoColor=FFFFFF)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=FFFFFF)

## Sobre o Projeto

Este projeto consiste no desenvolvimento de uma aplicação fullstack de e-commerce para a Void Clothing, uma marca de streetwear. O sistema tem como objetivo oferecer uma plataforma online para divulgação de coleções, visualização de produtos e realização de compras, além de um ambiente administrativo para gerenciamento de produtos, estoque, clientes, pedidos e operações da loja.

A proposta é centralizar os principais processos da loja em um único ambiente, proporcionando uma experiência de compra simples, moderna e segura para os clientes, enquanto facilita o controle e a organização das atividades administrativas.

## Funcionalidades

- Cadastro e autenticação de usuários
- Controle de acesso por perfil (administrador, funcionário e cliente)
- Cadastro e gerenciamento de produtos
- Organização de categorias e coleções
- Controle de estoque por tamanho e cor
- Catálogo com filtros de produtos
- Carrinho de compras
- Cálculo de frete
- Finalização de pedidos
- Gerenciamento e acompanhamento de pedidos
- Controle de pagamentos
- Cadastro e gerenciamento de clientes
- Painel administrativo

## Tecnologias utilizadas

- Frontend: React (Vite), React Router e Axios
- Backend: Node.js e Express
- Banco de dados: MySQL
- Autenticação: JWT

## Estrutura

```text
voidclothing/
├── backend/
├── frontend/
├── database/
├── docs/
├── .gitignore
└── README.md
```

## Banco de dados

O banco se chama `db_voidclothing`. Importe os scripts da pasta `database/` nesta ordem, a partir da raiz do projeto:

```bash
mysql -u root -p -e "source database/schema.sql"
mysql -u root -p -e "source database/seed.sql"
```

- `schema.sql`: cria o banco e as tabelas (apaga e recria o banco, então os dados existentes são perdidos).
- `seed.sql`: insere os dados de teste.

Alternativa: abra cada arquivo no MySQL Workbench e execute tudo, primeiro o `schema.sql` e depois o `seed.sql`.

### Usuários de teste

Senha de todos: `Senha@123`

| Perfil | E-mail |
|---|---|
| admin | admin@voidclothing.com |
| funcionario | funcionario@voidclothing.com |
| cliente | lucas@email.com |

## Como rodar

Pré-requisitos: Node.js 20+ e MySQL 8+. Antes, importe o banco (seção acima).

São dois terminais, um para o backend e outro para o frontend.

**Backend** (terminal 1):

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

No Windows, use `copy .env.example .env`. Abra o `.env` e preencha `DB_USER`, `DB_PASSWORD` e `JWT_SECRET`. A API roda em `http://localhost:3000`.

**Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O frontend repassa as chamadas `/api` para o backend, então os dois precisam estar rodando.

Para testar a conexão: `http://localhost:5173/exemplo`.

## Fluxo de trabalho

- A `main` é protegida: nada de commit direto.
- Cada tela em uma branch própria: `feat/catalogo`, `feat/carrinho`...
- Alterações vão por Pull Request, revisado pela outra pessoa.
- Se mudar o banco, atualize `database/schema.sql` e `seed.sql` e avise a outra.