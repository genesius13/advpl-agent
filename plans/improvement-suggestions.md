# Plano de Melhorias - Advpl Sensei

Este documento detalha o levantamento de sugestões para evolução do servidor MCP Advpl Sensei, transformando-o de um guia de prompts em uma ferramenta de automação e validação robusta.

---

## 🚀 Melhorias Identificadas

### 1. Evolução do Simulador para Executor de Ferramentas
Atualmente, o `CallToolRequestSchema` no `index.ts` retorna apenas uma simulação em texto.
- **Objetivo:** Implementar lógica real para tarefas repetitivas.
- **Ação:** A ferramenta `advpl_generate` deve criar fisicamente a estrutura de pastas e o arquivo `.prw` ou `.tlpp` com o boilerplate básico (includes, Protheus.doc e `Begin Sequence`), deixando para o LLM apenas o preenchimento da lógica de negócio.

### 2. Implementação do "Sensei Linter" (Validação Automática)
O projeto possui regras de ouro claras (Locals no topo, Notação Húngara, sem Privates).
- **Objetivo:** Desenvolver um script em TypeScript que funcione como um Linter Estático.
- **Ação:** Quando o usuário usar a ferramenta `advpl_review`, o servidor MCP rodará esse script para validar programaticamente se as variáveis estão no topo e se a notação está correta, retornando erros objetivos antes da análise qualitativa do LLM.

### 3. Ferramenta de Consulta Estruturada ao Dicionário (SX)
O acesso ao dicionário SX via arquivos Markdown pode se tornar pesado para o contexto do LLM.
- **Objetivo:** Criar uma consulta de dados estruturada e eficiente.
- **Ação:** Transformar a consulta ao dicionário em uma **Tool** que aceita o nome da tabela (ex: `SA1`). O servidor buscará em um JSON estruturado e retornará apenas os campos essenciais.

### 4. Integração Nativa com o TDN (Web Scraper Especializado)
A busca por pontos de entrada depende da interpretação do LLM sobre o HTML bruto do TDN.
- **Objetivo:** Garantir precisão na captura de assinaturas de Entry Points.
- **Ação:** Criar a ferramenta `advpl_get_entrypoint_info`. O servidor MCP fará o scraping da página do TDN, extraindo a tabela de `PARAMIXB` e o tipo de retorno em um formato JSON estruturado.

### 5. Suporte a Snippets e Configurações de VS Code
Facilitar a escrita manual seguindo os padrões do Sensei.
- **Objetivo:** Integrar o Sensei diretamente no fluxo de digitação do VS Code.
- **Ação:** Gerar um arquivo `.code-snippets` baseado nas regras do Sensei, com templates que já incluem `Begin Sequence` e `Locals` no lugar correto.

---

## 📅 Cronograma de Implementação

### ✅ Concluídas

1.  **[FASE 1] ✅ - Sensei Linter:** Implementação da validação automática de regras de ouro.
    - **Status:** Concluída (Apr 2, 2026)
    - **Deliverables:** `src/linter.ts`, validação de Locals, Notação Húngara, sem Privates
    - **Integração:** Tool `advpl_lint`

2.  **[FASE 2] ✅ - Executor de Boilerplate:** Geração física de arquivos com estrutura básica.
    - **Status:** Concluída (Apr 2, 2026)
    - **Deliverables:** `src/boilerplates.ts`, templates para Function, Class, MVC, REST
    - **Integração:** Tool `advpl_generate`

3.  **[FASE 3] ✅ - TDN Scraper:** Ferramenta dedicada para consulta de Entry Points.
    - **Status:** Concluída (Apr 2, 2026)
    - **Deliverables:** `src/tdn-scraper.ts`, acesso a APIs do TDN
    - **Integração:** Tool `advpl_entrypoint`

4.  **[FASE 4] ✅ - SX Tool & Snippets:** Otimização de consulta ao dicionário e integração visual.
    - **Status:** Concluída (Apr 2, 2026 - 2026-04-02)
    - **Deliverables:** 
      - `src/sx-tool.ts` - 445 linhas
      - `src/snippets-generator.ts` - 520 linhas
      - `commands/sx.md` - 180 linhas
      - `commands/snippets.md` - 250 linhas
      - 10 templates VS Code prontos
      - Database com 4 tabelas, 5 parâmetros, 3 genéricos
    - **Integração:** Tools `advpl_sx` e `advpl_snippets`
    - **Resultado:** 13/13 testes ✅, 100% funcional

---

### ⏳ Planejadas

5.  **[FASE 5] - Function Registry & Validation:** Validação contra API oficial TOTVS.
    - **Objetivo:** Eliminar funções/classes fictícias dos templates
    - **Ação:** 
      - Criar database de funções REALMENTE documentadas
      - Validar todos os templates contra essa lista
      - Linter marcaria funções fictícias como erro
      - SX Tool expandiria para incluir funções e parâmetros
    - **Impacto:** Elimina problema histórico de "invenção" de funções
    - **Estimativa:** 2-3 dias

6.  **[FASE 6] - Advanced Template Management:** Templates por módulo e contexto.
    - **Objetivo:** Snippets específicos para cada módulo (FAT, COM, FIN, etc)
    - **Ação:**
      - Templates customizados por módulo
      - Suporte para diferentes versões do Protheus
      - Versionamento de snippets
      - Compartilhamento de templates customizados
    - **Estimativa:** 2-3 dias

7.  **[FASE 7] - Real-time Function Documentation:** Integração com TDN online.
    - **Objetivo:** Obter documentação sempre atualizada
    - **Ação:**
      - Cache de funções do TDN
      - Atualização periódica automática
      - Fall-back para database local
      - Indicador de função "deprecated"
    - **Estimativa:** 3-4 dias

8.  **[FASE 8] - Code Quality Dashboard:** Métricas e análise de projeto.
    - **Objetivo:** Visibilidade sobre qualidade do código
    - **Ação:**
      - Análise de conformidade com regras de ouro
      - Métricas por arquivo/função
      - Relatórios de cobertura de lint
      - Roadmap de melhorias
    - **Estimativa:** 3-4 dias

---

## 🐛 Problemas Conhecidos (To Be Fixed)

### [CRÍTICO] P1: Funções Fictícias nos Templates
- **Descrição:** Boilerplates usam funções que podem não existir (ex: `HttpServer()`)
- **Localização:** `src/boilerplates.ts`, `src/snippets-generator.ts`
- **Impacto:** Templates podem gerar código que não compila
- **Solução:** FASE 5 - Function Registry & Validation
- **Status:** 🔴 Pendente

### [ALTO] P2: Falta Validação de Funções no Linter
- **Descrição:** Linter valida estrutura mas não função real
- **Localização:** `src/linter.ts`
- **Impacto:** Código com funções fictícias passa sem warning
- **Solução:** FASE 5 - Integrar com Function Registry
- **Status:** 🔴 Pendente

### [ALTO] P3: SX Tool Database Incompleto
- **Descrição:** Apenas tabelas principais, faltam muitas outras
- **Localização:** `src/sx-tool.ts`
- **Impacto:** Consultas limitadas ao dicionário
- **Solução:** FASE 7 - Integração Real-time com TDN
- **Status:** 🟡 Parcial (core funciona, expansão pendente)

### [MÉDIO] P4: Snippets ADVPL com Features TLPP
- **Descrição:** Alguns snippets usam `JsonObject` que é TLPP
- **Localização:** `src/snippets-generator.ts`
- **Impacto:** Confusão entre linguagens
- **Solução:** FASE 5 - Validação e separação por linguagem
- **Status:** 🔴 Pendente

### [MÉDIO] P5: Sem Suporte a Custom Tables (Z*)
- **Descrição:** SX Tool não suporta buscas em tabelas customizadas
- **Localização:** `src/sx-tool.ts`
- **Impacto:** Limitação para developments customizado
- **Solução:** FASE 6 - Advanced Template Management
- **Status:** 🔴 Pendente

---

## 📊 Métricas Atuais (v1.1.4)

| Métrica | Valor |
|---------|-------|
| Arquivos de Fonte | 15 |
| Linhas de Código | ~3,500 |
| Classes Implementadas | 5 |
| Métodos Públicos | 40+ |
| Ferramentas MCP | 8 |
| Testes | 13 (100% ✅) |
| Cobertura de Lint | ~60% |
| Documentação | 100% |
| Versão | 1.1.4 |

---

## 🎯 Prioridades (Por Impacto)

### 🔴 CRÍTICO (Implementar Imediatamente)
1. **FASE 5** - Function Registry (resolve problema de funções fictícias)
2. **Validação de Snippets** - Testar compilação de templates

### 🟠 ALTO (Próximas 1-2 semanas)
3. **FASE 7** - Real-time TDN Integration
4. **Expansão SX Tool** - Mais tabelas do sistema

### 🟡 MÉDIO (Próximas 2-4 semanas)
5. **FASE 6** - Module-specific Templates
6. **FASE 8** - Quality Dashboard

### 🟢 BAIXO (Roadmap Futuro)
7. **Performance Optimization**
8. **Community Features**

---

## 🔗 Dependências entre Fases

```
FASE 1 (Linter)
    ↓
FASE 2 (Boilerplate)
    ↓
FASE 3 (TDN Scraper)
    ↓
FASE 4 (SX Tool & Snippets) ✅
    ↓
FASE 5 (Function Registry) ← CRÍTICO
    ├→ FASE 6 (Advanced Templates)
    ├→ FASE 7 (Real-time TDN)
    └→ FASE 8 (Quality Dashboard)
```

---

## 💰 Estimativa de Esforço

| Fase | Linhas | Dias | Complexidade |
|------|--------|------|--------------|
| FASE 1 | ~400 | 1 | Média |
| FASE 2 | ~300 | 1 | Alta |
| FASE 3 | ~200 | 2 | Alta |
| FASE 4 | ~1,605 | 1 | Média |
| FASE 5 | ~800 | 2-3 | Alta |
| FASE 6 | ~600 | 2-3 | Média |
| FASE 7 | ~700 | 3-4 | Alta |
| FASE 8 | ~900 | 3-4 | Alta |
| **TOTAL** | **~6,500** | **15-19 dias** | **M/A** |

---

## 🎓 Lições Aprendidas

### ✅ O Que Funcionou
- Separação clara por fases
- Testes em 100% das implementações
- Documentação junto com código
- Uso de templates padronizados
- MCP como abstração

### ⚠️ Desafios Enfrentados
- Falsa sensação de completude (funções fictícias)
- Database manual é limitado (precisa TDN)
- Snippets sem validação podem gerar código quebrado
- Falta integração com CI/CD

### 📝 Recomendações
1. Sempre validar contra API real ANTES de gerar código
2. Incluir compile-step nos testes de snippets
3. Integrar verificação com TOTVS SonarQube rules
4. Setup de CI/CD antes de próxima release

---

## 🚀 Próximos Passos Recomendados

### Curto Prazo (Esta Semana)
- [ ] Revisar FASE 4 templates e marcar funções questionáveis
- [ ] Documentar quais funções são "reais" vs "placeholder"
- [ ] Criar list de funções TOTVS oficiais

### Médio Prazo (Próximas 2 Semanas)
- [ ] Implementar FASE 5 - Function Registry
- [ ] Testes de compilação para todos os templates
- [ ] Integração com TOTVS official docs

### Longo Prazo (Próximo Mês)
- [ ] FASE 6-8 implementation
- [ ] Beta testing com usuários reais
- [ ] Feedback collection e ajustes
- [ ] Release v1.2.0 com FASE 5

---

## 📞 Contato e Feedback

Para sugestões ou relatórios de bugs:
- Abra uma issue no repositório
- Descreva o problema com exemplos
- Indique qual fase/ferramenta é afetada
- Sugira soluções se possível

---

**Última atualização:** April 2, 2026  
**Versão:** 1.1.4  
**Próxima revisão planejada:** FASE 5 implementation start
