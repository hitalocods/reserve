
# PRD - Sistema de Gestão de Barbearia Premium

## 1. Visão Geral
Sistema de gestão para barbearias individuais, com foco em experiência de usuário premium, simplicidade e desempenho.

## 2. Funcionalidades Principais
### 2.1 Landing Page
- Hero moderno
- Galeria de fotos
- Equipe de barbeiros
- Serviços e combos
- Promoções
- Horários de funcionamento
- Localização
- Integração Instagram/WhatsApp
- Botão "Agendar"
- Todo o conteúdo editável pelo painel admin

### 2.2 Fluxo de Agendamento (Cliente)
1. Escolha do serviço/combo
2. Escolha do barbeiro
3. Escolha da data
4. Escolha do horário disponível
5. Informações pessoais (nome, telefone)
6. Envio automático para WhatsApp

### 2.3 Painel Administrativo
- Dashboard com métricas (receita, atendimentos, gráficos)
- CRUD de serviços, combos, promoções
- CRUD de barbeiros
- Agenda completa com filtros
- Gerenciamento de horários, datas bloqueadas, férias
- Lista de clientes com histórico
- Configurações gerais (identidade visual, contatos, horários, etc.)

### 2.4 Link Exclusivo do Barbeiro
- Acesso apenas a sua própria agenda
- Visualização de atendimentos do dia
- Sem acesso a dados financeiros ou admin

## 3. Requisitos Não Funcionais
- **Tecnologias**: Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Prisma, Neon PostgreSQL, Vercel Blob, React Hook Form, Zod, Framer Motion, Lucide Icons
- **Design**: Premium, inspirado em Apple/Linear/Stripe/Notion, branco/preto/cinza claro/detalhes dourados, animações suaves
- **Performance**: Server Components, Lazy Loading, Image Optimization, queries otimizadas
- **Segurança**: Validação Zod, middleware de autenticação, rotas protegidas, Server Actions seguras

## 4. Design Visual
- Branco predominante
- Preto e cinza claro como cores base
- Detalhes dourados (accent color)
- Tipografia limpa e moderna
- Animações suaves com Framer Motion
- Totalmente responsivo (Mobile First)

## 5. Banco de Dados
Tabelas:
- admins
- barbers
- services
- combos
- promotions
- appointments
- customers
- settings
- business_hours
- blocked_dates
- gallery
- banners

