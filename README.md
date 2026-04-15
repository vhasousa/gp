# Brainstorm GP - MVP Assistente de RH por Voz (Meta Quest Browser)

Projeto full stack para demonstração rápida de um assistente de RH com entrada simplificada por seleção de usuário e autorização real por perfil no backend.

## Tecnologias

- **Frontend:** React + Vite
- **Backend:** Node.js 22.11 + Express
- **Banco:** MySQL 8+
- **Voz no navegador:** Web Speech API (com fallback por texto)

> Compatível com navegadores Chromium modernos, incluindo o navegador do Meta Quest.

---

## Estrutura de Pastas

```bash
.
├── backend
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── config
│       │   ├── db.js
│       │   └── env.js
│       ├── middleware
│       │   └── errorHandler.js
│       ├── routes
│       │   ├── user.routes.js
│       │   └── voice.routes.js
│       ├── services
│       │   ├── commandInterpreter.js
│       │   └── rhService.js
│       └── server.js
├── frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── useSpeechRecognition.js
└── sql
    └── init.sql
```

---

## Como executar localmente

## 1) Banco de dados MySQL

1. Crie o banco e os dados iniciais:

```bash
mysql -u root -p < sql/init.sql
```

Isso cria:
- usuários mockados (incluindo Ana, Bruno e Carla),
- permissões,
- vínculos role x permissão,
- logs de interação.

## 2) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend sobe em `http://localhost:4000`.

## 3) Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend sobe em `http://localhost:5173`.

> Para abrir no Meta Quest Browser, acesse o IP da máquina no mesmo Wi-Fi, por exemplo: `http://192.168.0.10:5173`.

---

## Fluxo do MVP

1. Tela inicial exibe usuários demo.
2. Usuário seleciona um perfil sem login/senha.
3. Painel principal habilita:
   - botão de captura por voz,
   - exibição da transcrição,
   - fallback por digitação,
   - resposta do assistente.
4. Comando vai para o backend.
5. Backend interpreta intenção, valida permissão por role, consulta MySQL e responde.
6. Toda interação é registrada em log.

---

## Perfis simulados

- **Ana Silva** — colaborador
- **Bruno Souza** — gestor
- **Carla Lima** — administrador

### Exemplos de restrição

- Ana (colaborador): acessa próprios dados (benefícios/cargo/setor/dados básicos).
- Bruno (gestor): acessa próprios dados e equipe.
- Carla (admin): acessa dados amplos (`listar funcionários`) e relatório administrativo.

---

## Rotas da API

- `GET /health`
- `GET /api/users/demo-users`
- `POST /api/voice/command`
  - body:
    ```json
    {
      "userId": 2,
      "command": "qual meu cargo?"
    }
    ```

---

## Resumo técnico solicitado

### 1) Captura de voz

No frontend, foi implementado um hook (`useSpeechRecognition`) usando `window.SpeechRecognition || window.webkitSpeechRecognition` (Web Speech API). A transcrição final é colocada no input e exibida na tela. Se a API não estiver disponível, o usuário usa fallback por texto.

### 2) Acesso simplificado

Ao abrir a aplicação, a tela inicial lista usuários demo e permite entrar com 1 clique. Não há autenticação tradicional no MVP.

### 3) Controle de acesso por role

Mesmo sem login formal, o backend recebe `userId`, identifica a role no MySQL e valida permissões (`role_permissions`) para cada intenção de comando. Se não tiver permissão, retorna `403` com “Acesso negado”.

### 4) Logs

Toda tentativa é gravada em `interaction_logs` com:
- usuário,
- role,
- comando,
- intenção,
- permitido/negado,
- timestamp.

---

## Comandos de demonstração recomendados

- "quais benefícios eu tenho?"
- "qual meu cargo?"
- "qual meu setor?"
- "mostrar meus dados cadastrais básicos"
- "mostrar equipe"
- "listar funcionários"
- "relatório geral"

---

## Observações de compatibilidade Meta Quest

- UI com botões grandes e pouco ruído visual.
- Elementos centrados para facilitar gaze/click.
- Sem câmera, sem QR Code, sem app nativo.
- Tudo roda em navegador web Chromium.
