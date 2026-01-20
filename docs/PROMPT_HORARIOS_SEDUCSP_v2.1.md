# PROMPT DETALHADO v2.1: SISTEMA DE GERAÇÃO DE HORÁRIOS ESCOLARES

## Plataforma Multi-Escola para 26 Instituições – Stack Moderno com Turso DB

**Versão:** 2.1 – Com Turso + categorias/jornadas SEDUC‑SP 2026  
**Data:** Janeiro 2026  
**Contexto:** Rede Estadual de Educação de São Paulo (SEDUC‑SP) – 26 escolas do interior paulista

---

## ÍNDICE

1. Visão Geral & Objetivos  
2. Contexto SEDUC‑SP 2026 (QM, categorias e jornadas)  
3. Requisitos Funcionais Detalhados  
4. Arquitetura Técnica com Turso  
5. Modelo de Dados Completo (Schema Turso/SQLite)  
6. Procedimentos e Algoritmos (passo a passo)  
7. Fluxos de Processo (UX)  
8. Tratamento de Erros  
9. Segurança, LGPD e Acessibilidade  
10. Estimativa, Sprints e Operações

---

## 1. VISÃO GERAL & OBJETIVOS

### 1.1 Objetivo Principal

Desenvolver uma **plataforma web responsiva** para **geração automática de horários de professores** em 26 escolas da SEDUC‑SP, permitindo:

- Cadastro centralizado de professores, turmas, disciplinas e turnos.  
- Consideração de **acúmulo de cargos** e de **categorias funcionais (A, P, N, F, O, V)** do Quadro de Magistério.  
- Respeito às **jornadas por carreira** (anterior e nova) em número de aulas semanais (9, 19, 20, 24, 32).  
- Geração automática de horários priorizando **categoria A > P/N/F > O > V**, com bloqueio de conflitos.  
- Exportação em PDF, Excel, CSV e iCal.  
- Operação multi‑escola com 3 turnos por unidade (matutino, vespertino, noturno).

### 1.2 Escolas Participantes (26 instituições)

```text
BARRINHA (2):
  • PEI EE Prof. José Luiz de Siqueira
  • EE Luiz Marcari

DUMONT (1):
  • PEI EE Prof. Nestor Gomes de Araújo

JARDINÓPOLIS (2):
  • EE Dr. Mário Lins
  • EE Prof. Plínio Berardo

PITANGUEIRAS (4):
  • PEI EE Domingos Paro
  • PEI EE Maria Falconi de Felício
  • EE Maurício Montecchi
  • EE Orminda Guimarães Cotrim

PONTAL (6):
  • EE Dona Adélia Frascino
  • EE Prof. Basílio Rodrigues da Silva
  • PEI EE Profª Dolores Belém Novaes
  • EE Profª Dolores Martins de Castro
  • EE Profª Josepha Castro
  • EE Profª Yolanda Luiz Sichieri

SERTÃOZINHO (9):
  • EE Anna Passamonti Balardin
  • PEI EE Dr. Antônio Furlan Júnior
  • EE Dr. Isaías José Ferreira
  • EE Ferrucio Chiaratti
  • EE Prof. Bruno Pieroni
  • EE Profª Edith Silveira Dalmaso
  • PEI EE Profª Maria Conceição R. Silva Magon
  • EE Profª Nícia Fabíola Zanutto Giraldi
  • PEI EE Winston Churchill

TERRA ROXA (1):
  • PEI EE Profª Maria Élyde Mônaco dos Santos

VIRADOURO (1):
  • EE Odulfo de Oliveira Guimarães
```

---

## 2. CONTEXTO SEDUC‑SP 2026 (QM, CATEGORIAS E JORNADAS)

### 2.1 Quadros e Categorias do Quadro de Magistério (QM)

Os docentes são organizados em **categorias funcionais** dentro do Quadro de Magistério (QM), distribuídos entre quadro permanente e não permanente.

- **Quadro Permanente** – Efetivos e não efetivos estáveis:  
  - **Categoria A**: docentes efetivos, titulares de cargo concursados, com **maior prioridade** na atribuição.  
  - **Categorias P, N, F**: não efetivos estáveis (P pela CF/88; N celetistas; F função‑atividade LC 1.010/2007), atendidos após A.

- **Quadro Não Permanente** – Contratados:  
  - **Categoria O**: contratados por tempo determinado (LC 1.093/2009), para vagas remanescentes.  
  - **Categoria V**: contratados apenas para aulas eventuais.

**Regra fundamental de prioridade (para o sistema):**

1. Categoria **A**  
2. Categorias **P, N, F** (mesma prioridade entre si, após A)  
3. Categoria **O**  
4. Categoria **V** (somente para eventuais, normalmente sem grade fixa)

O sistema deve armazenar a categoria de cada professor em um campo obrigatório `categoria_qm` com valores `'A' | 'P' | 'N' | 'F' | 'O' | 'V'`, e usar isso em toda lógica de ordenação de candidatos e validação de horários.

### 2.2 Jornadas de Trabalho – Carreira Anterior x Nova

Existem duas carreiras reconhecidas para 2026: **carreira anterior** e **nova carreira**, com jornadas expressas em número de aulas semanais.

- **Carreira anterior**:  
  - Jornada **Reduzida** – 9 aulas/semana.  
  - Jornada **Inicial** – 19 aulas/semana.  
  - Jornada **Básica** – 24 aulas/semana.  
  - Jornada **Integral** – 32 aulas/semana.

- **Nova carreira**:  
  - Jornada **Completa** – 20 aulas/semana.  
  - Jornada **Ampliada** – 32 aulas/semana.

O sistema deve representar isso com:

- Campo `carreira` em `professores`: `'ANTERIOR' | 'NOVA'`.  
- Campo `jornada_aulas` em `professores`: `9 | 19 | 20 | 24 | 32`, conforme combinação válida.

Toda validação de carga horária e acúmulo deve usar **`jornada_aulas` como teto absoluto** de aulas semanais do docente (somando todas as escolas).

### 2.3 Processo de Atribuição Oficial (referencial)

- Atribuição segue a **Resolução SEDUC nº 3/2026** e normas complementares, priorizando docentes do quadro permanente (A, depois P/N/F) e, em seguida, contratados (O, V).  
- Processo oficial ocorre na **Secretaria Escolar Digital (SED)**; o sistema aqui proposto é um apoio interno que deve modelar as mesmas prioridades e limites, mas não substitui a SED.

---

## 3. REQUISITOS FUNCIONAIS DETALHADOS

### 3.1 Autenticação e Autorização

Papéis sugeridos:

- `SUPER_ADMIN`
- `COORDENADOR_REGIONAL`
- `DIRETOR_ESCOLA`
- `SECRETARIO_HORARIOS`
- `PROFESSOR`

Requisitos:

- Login via email/senha com `bcrypt`.
- JWT com expiração e refresh.
- Escopo por escola e logs de auditoria.

### 3.2 Módulo 1: Cadastro de Professores

Campos principais:

- `nome` (obrigatório)
- `cpf` (obrigatório, único, validado)
- `email` (obrigatório)
- `telefone`
- `categoria_qm` (obrigatório): `'A' | 'P' | 'N' | 'F' | 'O' | 'V'`
- `carreira` (obrigatório): `'ANTERIOR' | 'NOVA'`
- `jornada_aulas` (obrigatório): 9, 19, 20, 24, 32
- `formacao`, `experiencia_anos`
- `disciplinas_ids[]`
- `escolas_ids[]`
- `status` (ATIVO/INATIVO)

Validações:

- Combinações válidas:
  - `ANTERIOR` ∈ {9, 19, 24, 32}
  - `NOVA` ∈ {20, 32}
- `categoria_qm = 'V'` sinaliza perfil para **aulas eventuais** (sem grade regular, por padrão).

### 3.3 Módulo 2: Acúmulo de Cargos

Regras:

- Permitir acúmulo em múltiplas escolas conforme configuração (ex.: até 3).
- Bloquear se a soma total de aulas semanais atribuídas (todas as escolas) exceder `professores.jornada_aulas`.

### 3.4 Módulo 3: Turnos

- Definição de turnos por escola: matutino/vespertino/noturno.
- Definição de “slots” (aulas) com horário início/fim.
- Definição de intervalos (recreio) e janelas.

### 3.5 Módulo 4: Disciplinas

- Cadastro por disciplina (nome, código, carga semanal, séries/anos).

### 3.6 Módulo 5: Turmas

- Cadastro por turma (escola, código, série, turno, sala).

### 3.7 Módulo 6: Grade Horária da Turma (sem professor)

- Matriz dia × aula.
- Atribuir disciplina por slot.
- Validar carga semanal por disciplina.

### 3.8 Módulo 7: Geração Automática de Horários (com professor)

Princípios:

- Sem conflito de horário (mesmo professor não pode estar em dois lugares no mesmo slot).
- Respeitar disponibilidade, acúmulo e teto de `jornada_aulas`.
- Priorizar categorias: A > P/N/F > O > V.

Ordenação de candidatos (SQL):

```sql
ORDER BY
  CASE p.categoria_qm
    WHEN 'A' THEN 1
    WHEN 'P' THEN 2
    WHEN 'N' THEN 2
    WHEN 'F' THEN 2
    WHEN 'O' THEN 3
    WHEN 'V' THEN 4
  END,
  aulas_alocadas ASC,
  p.nome ASC;
```

Regras específicas:

- Categoria **V** deve ser usada apenas quando `aula_tipo = 'EVENTUAL'` (substituições, coberturas), não na grade fixa.

---

## 4. ARQUITETURA TÉCNICA COM TURSO

- Frontend: React + Next.js + TypeScript + Tailwind.
- Backend: Node.js + Express.
- Banco: Turso (libSQL/SQLite remoto).
- Autenticação: JWT.
- Validação: Zod/Joi.
- CI/CD: GitHub Actions.

---

## 5. MODELO DE DADOS (TURSO / SQLITE)

### 5.1 Tabela `professores` (v2.1)

```sql
CREATE TABLE IF NOT EXISTS professores (
  id TEXT PRIMARY KEY,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  nome TEXT NOT NULL,
  categoria_qm TEXT NOT NULL,       -- 'A','P','N','F','O','V'
  carreira TEXT NOT NULL,           -- 'ANTERIOR' ou 'NOVA'
  jornada_aulas INTEGER NOT NULL,   -- 9, 19, 20, 24 ou 32
  formacao TEXT,
  experiencia_anos INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ATIVO',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_professores_categoria ON professores(categoria_qm);
CREATE INDEX IF NOT EXISTS idx_professores_carreira ON professores(carreira, jornada_aulas);
```

Outras tabelas (resumo mínimo; expandir conforme v2.0 do seu projeto):

- `escolas`
- `disciplinas`
- `turmas`
- `turnos`, `turno_aulas`, `turno_intervalos`
- `professor_escolas`, `professor_disciplinas`
- `acumulos_cargos`
- `grades_horarias` (turma_slot → disciplina)
- `alocacoes` (turma_slot → professor)
- `auditoria` (log)

---

## 6. PROCEDIMENTOS E ALGORITMOS (ATUALIZAÇÕES-CHAVE)

### 6.1 Regra universal de teto

```text
Se (aulas_total_professor + aulas_novas) > jornada_aulas -> BLOQUEAR
```

### 6.2 Seleção de candidatos (alto nível)

1. Buscar professores aptos (disciplina + escola + status ATIVO).
2. Ordenar por categoria_qm e menor carga alocada.
3. Filtrar por:
   - conflito de horário
   - disponibilidade/turno
   - teto de jornada_aulas
   - regras de acúmulo

---

## 7. FLUXOS DE PROCESSO (UX)

- Cadastro de escola/turnos → disciplinas → turmas → grade sem professor → geração automática → revisão manual → exportação.

---

## 8. ERROS E CÓDIGOS

- `ERRO_JORNADA_INVALIDA`
- `ERRO_EXCEDE_JORNADA_QM`
- `ERRO_CATEGORIA_INCOMPATIVEL` (ex.: V em grade fixa)

---

## 9. SEGURANÇA, LGPD E ACESSIBILIDADE

- Criptografia e minimização de dados (CPF).
- Controle de acesso por papel + escola.
- Logs/auditoria.
- Acessibilidade (WCAG).

---

## 10. SPRINTS (VISÃO)

- Sprint 1–2: autenticação + escolas/turnos  
- Sprint 3–4: professores (com categoria_qm/carreira/jornada) + disciplinas  
- Sprint 5–6: turmas + grade base  
- Sprint 7–9: geração automática + validações + conflitos  
- Sprint 10–12: relatórios/exportações + hardening + deploy

---

**Fim do arquivo v2.1**
