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

## Design

Identidade visual moderna, limpa e minimalista, com estética streetwear e urbana. Nada de cores vibrantes: o destaque fica por conta das fotos dos produtos.

[![Figma](https://img.shields.io/badge/Ver_protótipo_no_Figma-000000?style=for-the-badge&logo=figma&logoColor=FFFFFF)](https://www.figma.com/design/SulDYgCUK81IAmuAcRHY5r/Void?node-id=0-1&t=EKTI0P7aAESgEbg3-1)

### Paleta de cores

| Cor | Código | Uso |
|---|---|---|
| ![#111111](https://img.shields.io/badge/%20%20%20%20%20%20%20-111111?style=flat-square) | `#111111` | Textos, botões e fundos escuros |
| ![#000000](https://img.shields.io/badge/%20%20%20%20%20%20%20-000000?style=flat-square) | `#000000` | Títulos e estados de destaque |
| ![#8c8c8c](https://img.shields.io/badge/%20%20%20%20%20%20%20-8c8c8c?style=flat-square) | `#8c8c8c` | Textos secundários e detalhes |
| ![#FFFFFF](https://img.shields.io/badge/%20%20%20%20%20%20%20-FFFFFF?style=flat-square) | `#FFFFFF` | Fundos e textos sobre áreas escuras |

### Tipografia

- **Archivo** (larga e pesada): títulos e destaques
- **Inter**: textos, formulários e botões

### Referências

- **Shopee:** facilidade de navegação, organização dos produtos e processo de compra
- **Nike:** apresentação visual dos produtos, identidade da marca e organização das coleções

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
