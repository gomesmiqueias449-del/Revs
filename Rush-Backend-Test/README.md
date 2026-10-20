# Rush Photon Test Login Backend

Backend de teste do Rush-Revs com `GET /health`, `GET /config`, `POST /user/login` e `POST /user/rename`. Não oferece cadastro, recuperação de senha, torneios ou outras APIs.

## Login e troca de nome gratuita

`POST /user/login` exige `deviceId`, `country` e `hash` não vazios. Mantém o formato de resposta esperado pelo mod e deriva um ID estável do dispositivo. O nome padrão é `TestPlayer` e pode ser alterado por `TEST_USERNAME`.

`POST /user/rename` recebe `id`, `deviceId`, `hash` e `username`. A troca custa zero, confirma `{ ok: true, free: true, id, username }` e aceita nomes de 1 a 32 caracteres sem caracteres de controle. O ID precisa corresponder ao `deviceId`; depois da troca, o login do mesmo dispositivo retorna o novo nome enquanto o processo do servidor permanecer ativo.

**Persistência e segurança:** este é um backend de teste, sem banco de contas. Os nomes são mantidos apenas na memória do processo e podem voltar a `TestPlayer` após reinicialização ou novo processo. O servidor não autentica a identidade: aceita qualquer `hash` não vazio e o ID deriva de `deviceId`. Não use com contas reais, dados sensíveis ou como backend de produção.

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

O serviço Render usa a branch `backend-login-only`, diretório `Rush-Backend-Test`, comando de build `cd Rush-Backend-Test && npm install` e comando de inicialização `cd Rush-Backend-Test && npm start`.
