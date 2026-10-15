# Rush Photon Test Backend

Backend de teste do Rush-Revs, publicado em `https://rush-photon-test-backend-revs.onrender.com`. Oferece `GET /health`, `GET /config` e `POST /user/login/` para autenticar um perfil de teste usado pelo mod.

## Photon

O App ID configurado é `73ce7592-a817-42ff-8e4a-660418a96536`, correspondente ao app **Rush-Revs Quantum 2.1**. A rota `/config` apenas publica esse identificador: ela **não hospeda Photon Cloud**, não configura o painel Photon e não implementa uma sessão de jogo ou matchmaking.

## Limitações importantes

- Este é um **stub de teste**, não um backend completo nem pronto para produção.
- `POST /user/login/` aceita qualquer `hash` não vazio, não valida contas e não persiste jogadores. Ele pode aprovar um perfil de teste para o fluxo de entrada do mod, mas não fornece inventário, salas privadas, matchmaking, compras ou os demais serviços do jogo.
- As rotas oficiais do jogo continuam apontadas para o backend existente, pois este serviço não implementa a API completa da build 0.56.
- Não use esta API com contas reais nem dados de jogadores. Um backend de produção precisa de autenticação validada no servidor, armazenamento persistente, proteção contra abuso e especificação de todas as rotas que o jogo usa.

## Rodar localmente

Requer Node.js 20 ou mais recente. Não há dependências externas.

```bash
npm test
npm start
```

Por padrão, a API escuta em `0.0.0.0:10000`. Configure `PHOTON_APP_ID`, `TEST_USERNAME` e `PORT` por variáveis de ambiente quando necessário. `.env.example` mostra os valores de teste; não é lido automaticamente pelo Node.

Teste rápido:

```bash
curl http://localhost:10000/health
curl http://localhost:10000/config
curl -X POST http://localhost:10000/user/login/ \
  -H 'Content-Type: application/json' \
  -d '{"deviceId":"device-test-1","country":"BR","hash":"test-only"}'
```

## Deploy

O serviço Render usa a branch `add-rush-backend-test` do repositório `gomesmiqueias449-del/Revs` e faz deploy automático após cada commit. No plano Free, pode hibernar por inatividade. Depois de atualizar o código, confira `/health`, `/config` e `POST /user/login/`.
