# Registry Validation & Maintenance Guide

## 🎯 Como Manter a Qualidade do Function Registry

### 1. Validação Automática

**Execute regularmente:**
```bash
npm run check:registry
```

**O que verifica:**
- ✅ Consistência: todos os campos obrigatórios preenchidos
- ✅ Duplicatas: funções repetidas
- ✅ Categorias: tipos válidos
- ✅ Completude: documentação adequada
- ✅ Status: obsoletas, fictícias, incompletas

**Score esperado: 95+** (se < 85, há problemas críticos)

---

### 2. Estrutura de Uma Função Válida

```typescript
"Nome_Da_FUnção": {
  name: "Nome_Da_Função",              // Obrigatório: exato do código
  type: "native",                       // Obrigatório: native|framework|class|object
  language: "advpl",                    // Obrigatório: advpl|tlpp|both
  category: "Database",                 // Obrigatório: ver FUNCTION_CATEGORIES
  description: "Descrição clara...",   // Obrigatório: mín. 10 caracteres
  signature?: "Nome(param1, param2)",  // Recomendado: sintaxe de uso
  deprecated?: false,                   // Opcional: marca como obsoleta
  introduced?: "1.0",                   // Opcional: versão introduzida
  module?: ["FAT", "COM"],              // Opcional: módulos onde funciona
}
```

**Regras:**
- `name` deve ser EXATAMENTE como aparece no código
- `type` classifica o tipo de coisa
- `language` especifica compatibilidade
- `category` deve estar em `FUNCTION_CATEGORIES`
- `description` não pode ser vazia ou genérica

---

### 3. Quando Adicionar Uma Função

Adicione quando:
- ✅ Está na documentação oficial TOTVS
- ✅ Aparece em código de produção real
- ✅ É parte do SDK ou framework
- ✅ Possui assinatura bem definida

**Não adicione:**
- ❌ Funções que você "acha" que existem
- ❌ Funções de bibliotecas externas
- ❌ Funções com nomes genéricos/confusos
- ❌ Duplicatas de outras entradas

---

### 4. Categorias e Suas Responsabilidades

| Categoria | Contém | Exemplos |
|-----------|--------|----------|
| **Declarations** | Declarações de função | User Function, Static Function |
| **Database** | Operações de DB | DbSeek, Eof, GetArea |
| **String** | Manipulação strings | Upper, Lower, StrTran |
| **Type** | Conversão/verificação | Val, Str, CtoD |
| **Interface** | UI/Screens | GetSX1, MsgBox, Alert |
| **Parameters** | Parâmetros sistema | GetMV, PutMV, GetSX5 |
| **Framework** | FW classes/funções | FWMBrowse, FWSX1Util |
| **MVC** | MVC classes | MPFormModel, FWFormView |
| **REST** | REST APIs | HttpServer, JsonObject |
| **ErrorHandling** | Erros/exceções | GetException, Throw |

---

### 5. Como Documentar Corretamente

❌ **Ruim:**
```typescript
"GetArea": {
  name: "GetArea",
  type: "native",
  language: "advpl",
  category: "Database",
  description: "Get area",  // Muito vago!
```

✅ **Bom:**
```typescript
"GetArea": {
  name: "GetArea",
  type: "native",
  language: "advpl",
  category: "Database",
  description: "Salva o estado atual de todas as áreas de trabalho (aliases)",
  signature: "Local aArea := GetArea()",
  module: ["geral"],
```

**Dicas de description:**
- Usar português claro
- Mínimo 20 caracteres (preferencialmente 50+)
- Incluir PARA QUÊ serve a função
- Ser específico, não genérico

---

### 6. Detecção de Problemas Comuns

| Problema | Sinal | Ação |
|----------|-------|------|
| **Duplicata** | Mesmo `name`, keys diferentes | Merge em uma entrada |
| **Fictícia** | Não compila em Protheus real | Marca com ❌ ou deprecated |
| **Incompleta** | Sem description ou type | Completa todos os campos |
| **Inválida** | Type/language/category errados | Consulta docs e corrige |
| **Descontinuada** | Não funciona em versão nova | Marca deprecated=true |

---

### 7. Ciclo de Vida de Uma Função

```
1. DISCOVERY
   └─ Encontrada em código, docs ou TDN
   
2. RESEARCH
   └─ Verificar em TOTVS docs oficiais
   └─ Confirmar sintaxe exata
   └─ Determinar compatibilidade (ADVPL/TLPP)
   
3. ADDITION
   └─ Criar entry no registry
   └─ Preencher TODOS os campos obrigatórios
   └─ Executar npm run check:registry
   
4. VALIDATION
   └─ Score deve ser >= 95
   └─ Sem erros na análise
   └─ Testes passando
   
5. MAINTENANCE
   └─ Monitorar relatórios mensalmente
   └─ Atualizar se status muda
   └─ Remover se ficar obsoleta
```

---

### 8. Processo de Expansão do Registry

Para adicionar 30-40 funções novas:

#### Fase 1: Auditoria (2 horas)
```bash
# 1. Listar funções usadas em todos os projetos
grep -r "^\s*[A-Za-z_]\w*\s*(" . | grep -v node_modules > used_functions.txt

# 2. Cruzar com registry
# 3. Identificar gaps
```

#### Fase 2: Pesquisa (4-8 horas)
Consultar:
- TOTVS Official Documentation
- SonarQube Rules (advpl-rules)
- TDN (Tecnologia TOTVS) 
- Código de referência (Sankhya, LLBroker)

#### Fase 3: Documentação (2-4 horas)
Para cada função:
```typescript
// Template
"FunctionName": {
  name: "FunctionName",
  type: "native",  // ou framework/class
  language: "advpl",  // ou tlpp/both
  category: "Category",  // ver lista
  description: "O que faz, para quê serve, resultado",
  signature: "FunctionName(param1, param2) → result",
  introduced: "Protheus 12.1.25+",
  module: ["FAT"],
}
```

#### Fase 4: Validação (1-2 horas)
```bash
npm run check:registry
# Score deve ser >= 95
# Sem erros críticos
# Recomendações implementadas
```

---

### 9. Padrões de Validação a Usar

Toda vez que adicionar função, use template:

```typescript
/**
 * [CATEGORIA] - [TIPO]
 * Protheus: [VERSÃO MÍNIMA]
 * Compatibility: ADVPL-only / TLPP-only / Both
 */
"NomeFuncao": {
  name: "NomeFuncao",
  type: "native",  // ← sempre lowercase
  language: "advpl",  // ← sempre lowercase
  category: "Database",  // ← match FUNÇÃO_CATEGORIES exactly
  description: "Descrição detalhada do que faz",
  signature: "NomeFuncao(param1 as Type, param2 as Type) → ReturnType",
  module: ["FAT", "COM"],  // ← módulos aplicáveis
}
```

---

### 10. Checklist para PR/Commit

Antes de commitar mudanças no registry:

```
[ ] npm run check:registry executou
[ ] Score >= 95
[ ] Sem erros (ERROR count = 0)
[ ] Sem duplicatas
[ ] Todos os campos obrigatórios preenchidos
[ ] Description tem mín. 20 caracteres
[ ] Signature example adicionada (para natives)
[ ] Category existe em FUNCTION_CATEGORIES
[ ] Type é um de: native|framework|class|object
[ ] Language é um de: advpl|tlpp|both
[ ] Não há comentários de debug
[ ] Funções novas testadas em teste de integração
```

---

### 11. Manutenção Periódica

**Semanal:**
- Executar `npm run check:registry`
- Se score cair, investigar imediatamente

**Mensal:**
- Revisar relatório de qualidade
- Procurar funções descontinuadas
- Pesquisar novas funções para adicionar

**Trimestral:**
- Auditoria completa
- Buscar por deprecations
- Atualizar versões mínimas

---

### 12. Sinais de Problemas

🔴 **CRÍTICO** (Score < 40):
- Não use em produção
- Corrija TODOS os erros
- Revise estructura completa

🟠 **ALTO** (40-70):
- Problemas significativos
- Corrija antes de expandir
- Executa testes frequentemente

🟡 **MÉDIO** (70-85):
- Alertas, mas utilizável
- Corrija issues em próximo ciclo
- Monitore próximas mudanças

🟢 **BOM** (85-95):
- Qualidade aceitável
- Manutenção contínua recomendada

✅ **EXCELLENT** (95+):
- Pronto para produção
- Continua assim!

---

## 🛠️ Ferramentas Disponíveis

### Registry Analyzer
```bash
npm run check:registry
```
Retorna análise JSON ou texto com score de qualidade

### Validation Rules (Linter)
```bash
npm run test:phase5
```
Valida templates contra registry

### Boilerplate Integration
```bash
npm run test:phase5-integration
```
Testa se boilerplates geram código válido

---

## 📚 Referências Recomendadas

Para expandir registry, consulte:

1. **TOTVS Official Docs**: https://tdn.totvs.com
2. **SonarQube Rules**: advpl-rules repository
3. **Function References**: Protheus SDK documentation
4. **Real Code**: Código de produção em repositórios
5. **Forums**: TDN forums, communities

---

## Sumário

**A melhor forma de manter registry válido é:**

1. ✅ Usar ferramenta de análise automática (`npm run check:registry`)
2. ✅ Manter score >= 95
3. ✅ Documentar bem cada função
4. ✅ Expandir incrementalmente (não tudo de uma vez)
5. ✅ Revisar regularmente
6. ✅ Manter consistência de estrutura

**Não:**
- ❌ Adicione funções que "acha" que existem
- ❌ Deixe erros acumularem
- ❌ Skip validação automática
- ❌ Use nomes inconsistentes

---

**Responsativa de Qualidade: Score >= 95 sempre** 🚀
