# Regina Times - Sistema de Geração de Horários Escolares

Sistema de geração automática de horários para 26 escolas da SEDUC-SP (Secretaria de Educação do Estado de São Paulo).

## Funcionalidades

- **Gestão Multi-Escola**: Suporte para 26 instituições em 8 cidades do interior paulista
- **Categorias QM**: Priorização por categoria do Quadro de Magistério (A > P/N/F > O > V)
- **Jornadas de Trabalho**: Suporte a carreiras anterior e nova (9, 19, 20, 24, 32 aulas/semana)
- **Geração Automática**: Algoritmo de alocação respeitando conflitos e prioridades
- **Acúmulo de Cargos**: Controle de professores em múltiplas escolas
- **Exportação**: PDF, Excel, CSV e iCal

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, API Routes do Next.js
- **Banco de Dados**: Turso (libSQL/SQLite distribuído)
- **ORM**: Drizzle ORM
- **Autenticação**: JWT com cookies HTTP-only
- **UI Components**: Radix UI, Lucide Icons

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Turso (https://turso.tech)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/dansfisica85/regina-times.git
cd regina-times
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu-token
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
```

4. Execute as migrations do banco:
```bash
npm run db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas do painel
│   │   ├── escolas/       # Gestão de escolas
│   │   ├── professores/   # Cadastro de professores
│   │   ├── disciplinas/   # Disciplinas
│   │   ├── turmas/        # Turmas
│   │   ├── grades/        # Grade horária
│   │   └── geracao/       # Geração automática
│   └── login/             # Autenticação
├── components/
│   └── ui/                # Componentes UI reutilizáveis
└── lib/
    ├── db/                # Schema e conexão Turso
    ├── auth.ts            # Autenticação JWT
    ├── validations.ts     # Schemas Zod
    ├── geracao-horarios.ts # Algoritmo de geração
    ├── export.ts          # Funções de exportação
    └── utils.ts           # Utilitários gerais
```

## Escolas Participantes

| Cidade | Escolas |
|--------|---------|
| Barrinha | 2 |
| Dumont | 1 |
| Jardinópolis | 2 |
| Pitangueiras | 4 |
| Pontal | 6 |
| Sertãozinho | 9 |
| Terra Roxa | 1 |
| Viradouro | 1 |

**Total: 26 escolas**

## Categorias do Quadro de Magistério

| Prioridade | Categoria | Descrição |
|------------|-----------|-----------|
| 1º | A | Docentes efetivos, titulares de cargo |
| 2º | P, N, F | Estáveis CF/88, Celetistas, Função-atividade |
| 3º | O | Contratados LC 1.093/2009 |
| 4º | V | Aulas eventuais (somente substituições) |

## Jornadas de Trabalho

### Carreira Anterior
- Reduzida: 9 aulas/semana
- Inicial: 19 aulas/semana
- Básica: 24 aulas/semana
- Integral: 32 aulas/semana

### Nova Carreira
- Completa: 20 aulas/semana
- Ampliada: 32 aulas/semana

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar em produção
npm run lint         # Verificar código
npm run db:push      # Sincronizar schema com banco
npm run db:studio    # Interface visual do banco
npm run db:generate  # Gerar migrations
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto foi desenvolvido para a SEDUC-SP como ferramenta interna de apoio à gestão de horários escolares.

## Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
