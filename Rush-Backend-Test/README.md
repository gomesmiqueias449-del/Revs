# Rush Photon Test Backend

API mínima de teste preparada para Render. Ela oferece `GET /health`, `GET /config` e `POST /user/login/` com os campos que o trecho de autenticação do mod espera.

## Limites importantes

- Este é um **stub de teste**, não um backend completo nem pronto para produção.
- O login aceita qualquer `hash` não vazio; não valida contas, não persiste dados e não implementa as demais rotas do backend do jogo.
- A rota `/config` apenas devolve o App ID Photon confirmado (`38243ef8-cd92-46b6-b3d1-e27a6a34959b`). Isso **não hospeda Photon Cloud** nem faz o mod buscar o App ID. O cliente ainda precisa estar configurado com o App ID para conectar-se ao Photon.
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

## Publicar no Render

1. Envie esta pasta para um repositório Git acessível pela sua conta Render.
2. No Render, crie `New → Web Service` e conecte o repositório.
3. Use runtime `Node`, build command `npm install` e start command `npm start`.
4. Defina `PHOTON_APP_ID` como `38243ef8-cd92-46b6-b3d1-e27a6a34959b` e, se quiser, `TEST_USERNAME=TestPlayer`.
5. Depois do deploy, valide `/health`, `/config` e `/user/login/`.

O serviço usa a variável `PORT` do Render e escuta em `0.0.0.0`. No plano gratuito, o serviço pode hibernar por inatividade. O código está pronto para teste, mas o deploy aguarda a reconexão da conta Render e o repositório Git informado pelo usuário.
