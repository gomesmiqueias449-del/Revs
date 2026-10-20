# Rush Photon Test Login Backend

Backend de teste do Rush-Revs com `GET /health`, `GET /config` e `POST /user/login`. Não oferece cadastro, recuperação de senha, renomeação, torneios ou outras APIs.

## Login de teste

O endpoint `POST /user/login` exige `deviceId`, `country` e `hash` não vazios. Mantém o formato de resposta esperado pelo mod e deriva um ID estável a partir do dispositivo. O nome padrão é `TestPlayer` e pode ser alterado por `TEST_USERNAME`.

**Isto não é autenticação real de usuários existentes:** o servidor não consulta um banco de contas, não valida a identidade e aceita qualquer `hash` não vazio. Use exclusivamente no ambiente de teste/mod; não use com contas reais ou dados sensíveis.

## Photon

O App ID configurado é `73ce7592-a817-42ff-8e4a-660418a96536`, correspondente ao app **Rush-Revs Quantum 2.1**. `/config` apenas publica o identificador; não hospeda Photon Cloud nem implementa sessões ou matchmaking.

## Executar localmente

Requer Node.js 20 ou mais recente. Não há dependências externas.

```bash
npm test
npm start
```

A API escuta em `0.0.0.0:10000` por padrão. Variáveis suportadas: `PHOTON_APP_ID`, `TEST_USERNAME` e `PORT`. O arquivo `.env.example` é apenas referência; Node não o carrega automaticamente.

## Deploy

Configure o serviço Render para usar a branch `backend-login-only`, com diretório raiz `Rush-Backend-Test`, comando de build `npm install` e comando de inicialização `npm start`.
