# Controle Financeiro Full Stack

<img width="887" height="820" alt="image" src="https://github.com/user-attachments/assets/fb7e5636-5fde-48e4-9eed-5c513753dc17" />

Projeto desenvolvido para gerenciamento de finanças pessoais, permitindo adicionar entradas e saídas, visualizar o saldo total e histórico de transações. O sistema utiliza uma arquitetura moderna com React no frontend e Node.js no backend.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** (Vite)
- **TypeScript**
- **CSS Modules**

### Backend
- **Node.js**
- **Express**
- **SQLite** (Banco de dados)
- **TypeScript**

## ✨ Funcionalidades

- [x] Cadastro de Transações (Entrada/Saída)
- [x] Listagem de histórico
- [x] Cálculo automático de saldo
- [x] Exclusão de transações
- [x] Edição de transações (CRUD Completo)

## 📦 Como rodar o projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado em sua máquina.

### 1. Backend (Servidor)
```bash
# Entre na pasta raiz e instale as dependências
npm install

# Inicie o servidor
npx ts-node-dev server.ts

# O servidor rodará na porta 3333
```
### Frontend (Web)
```bash
# Entre na pasta do frontend
cd money-tracker

# Instale as dependências
npm install

# Inicie o projeto
npm run dev
