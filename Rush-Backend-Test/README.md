# Rush Photon Test Backend

Backend de teste do Rush-Revs, publicado em `https://rush-photon-backend-revs-v2.onrender.com`. Oferece `GET /health`, `GET /config`, `POST /user/login/`, `POST /user/rename` e rotas experimentais de torneio.

## Photon

O App ID configurado é `73ce7592-a817-42ff-8e4a-660418a96536`, correspondente ao app **Rush-Revs Quantum 2.1**. A rota `/config` apenas publica esse identificador: ela **não hospeda Photon Cloud**, não configura o painel Photon e não implementa uma sessão de jogo ou matchmaking.

## Renomeação gratuita no mod

`POST /user/rename` recebe `id`, `deviceId`, `hash` e `username`. Valida que o ID corresponde ao identificador derivado do dispositivo e limita o nome a 32 caracteres sem controles. Cada troca responde com `ok: true` e `free: true`; o endpoint não desconta gemas. O login retorna o último nome recebido para o mesmo ID enquanto o armazenamento do processo estiver disponível.

Por padrão, os nomes ficam apenas em memória e podem ser perdidos quando o serviço reinicia ou hiberna. `USER_STORE_FILE` pode apontar para um arquivo JSON, mas ele só é durável se estiver em um volume persistente montado. O serviço atual está no plano Free e não tem esse volume; portanto, não configurei persistência que pareça durável mas não seja.

## Limitações e segurança

Este é um **stub de teste**, não um backend completo nem pronto para produção. O login aceita qualquer `hash` não vazio e a rota de renomeação não verifica a propriedade de uma conta oficial. O `hash` enviado pelo mod não é uma autenticação segura, pois está no cliente. A rota é publicamente acessível e serve somente para os perfis de teste deste mod; não use com contas reais, dados sensíveis ou como backend de produção.

As rotas oficiais do jogo continuam apontadas para o backend existente, pois este serviço não implementa a API completa da build 0.56. Um backend de produção precisa de autenticação validada no servidor, armazenamento persistente, proteção contra abuso e especificação de todas as rotas que o jogo usa.

## Rodar localmente

Requer Node.js 20 ou mais recente. Não há dependências externas.

```bash
npm test
npm start
```

Por padrão, a API escuta em `0.0.0.0:10000`. Configure `PHOTON_APP_ID`, `TEST_USERNAME`, `USER_STORE_FILE` e `PORT` por variáveis de ambiente quando necessário. `.env.example` mostra os valores de teste; não é lido automaticamente pelo Node.

Teste rápido:

```bash
curl http://localhost:10000/health
curl http://localhost:10000/config
curl -X POST http://localhost:10000/user/login/ \
  -H 'Content-Type: application/json' \
  -d '{"deviceId":"device-test-1","country":"BR","hash":"test-only"}'
```

## Deploy

O serviço Render usa a branch `add-rush-backend-test` do repositório `gomesmiqueias449-del/Revs` e faz deploy automático após cada commit. No plano Free, pode hibernar por inatividade. Depois do deploy, confira `/health`, `/config`, `POST /user/login/` e `POST /user/rename`.
