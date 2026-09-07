# Gestão de Salão — PWA

App mobile-first para substituir controles manuais de atendimentos e pagamentos das profissionais: agenda, atendimentos, clientes, pacotes e fechamento financeiro.

## Rodando localmente

```bash
npm install
npm run dev
```

Login de demonstração: `admin@salao.com` / `123456`

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (paleta pastel definida no `src/index.css`)
- Zustand com persistência em `localStorage`
- `vite-plugin-pwa` (manifest + service worker, instalável no celular)
- React Router

## Estado atual

Todos os dados (clientes, profissionais, serviços, pacotes, agendamentos, atendimentos e fechamentos) ficam salvos no `localStorage` do navegador — funciona offline e é instalável como app, mas **não sincroniza entre dispositivos** e o login não é uma autenticação real (é apenas um portão local).

Próximo passo natural: conectar a um backend real (Supabase é a opção já usada no ecossistema) para autenticação de verdade e dados compartilhados entre celulares/profissionais.

## Build de produção

```bash
npm run build
npm run preview
```
