# 🚀 Guia Prático - FASE 4: Como Usar as Novas Ferramentas

**Versão:** 1.1.4  
**Data:** April 2, 2026  

---

## 1️⃣ SX Tool - Consulta ao Dicionário

### Quando Usar

✅ **Preciso descobrir quais campos tem a tabela SA1?**  
✅ **Qual é o tipo de dado de um campo específico?**  
✅ **Quais parâmetros do sistema existem?**  
✅ **Como validar um estado usando as tabelas genéricas?**  

### Exemplos de Uso

#### Exemplo 1: Conhecer a tabela SA1 (Clientes)
```
Usuario: "Quais são os campos da tabela SA1?"

Copilot irá usar:
  Tool: advpl_sx
  action: get_table
  query: SA1

Resultado:
  # Tabela: SA1
  **Descrição:** Clientes
  
  ## Campos (4)
  
  ### A1_COD (C6)
  - Código do cliente
  - Obrigatório: Sim
  
  ### A1_NOME (C40)
  - Razão social do cliente
  - Obrigatório: Sim
  ... etc
```

#### Exemplo 2: Buscar campos que contenham "COD"
```
Usuario: "Que campos de SA1 têm 'COD' no nome?"

Copilot irá usar:
  Tool: advpl_sx
  action: search_fields
  query: SA1|*COD

Resultado:
  ## Campos Encontrados em SA1
  
  - **A1_COD** (C6): Código
```

#### Exemplo 3: Obter parâmetros financeiros
```
Usuario: "Qual a taxa de juros padrão do sistema?"

Copilot irá usar:
  Tool: advpl_sx
  action: get_parameters
  query: Financeiro

Resultado:
  Parâmetros do Módulo: Financeiro
  
  - **MV_MOEDA1** (N): Moeda padrão
    Padrão: `1`
  
  - **MV_JUROS** (N): Taxa de juros padrão
    Padrão: `0`
  
  - **MV_MULTA** (N): Multa padrão para atraso
    Padrão: `0`
```

#### Exemplo 4: Validar estados
```
Usuario: "Quais são os estados válidos?"

Copilot irá usar:
  Tool: advpl_sx
  action: get_generic_table
  query: 13

Resultado:
  ## Tabela Genérica: 13 - Estados/Províncias
  
  - **AC**: Acre
  - **AL**: Alagoas
  - **SP**: São Paulo
  - **RJ**: Rio de Janeiro
```

---

## 2️⃣ Snippets Generator - Templates de Código

### Quando Usar

✅ **Quero criar uma função mas não lembro como estruturar**  
✅ **Preciso fazer uma classe TLPP com namespace**  
✅ **Vou criar um report com Pergunte()**  
✅ **Quero gerar uma REST API**  

### Instalação (Uma Vez)

#### Passo 1: Gerar os Snippets
```
Usuario: "Gere snippets VS Code para mim"

Copilot irá usar:
  Tool: advpl_snippets
  action: generate_vscode
  output: .vscode/advpl-sensei.code-snippets

Resultado:
  ✅ Arquivo de snippets gerado com sucesso!
  
  **Local:** `.vscode/advpl-sensei.code-snippets`
  
  Agora você pode usar os snippets no VS Code
  digitando os prefixos (ex: `advpl_func`)
```

#### Passo 2: Usar no VS Code
1. Abra um arquivo `.prw` ou `.tlpp`
2. Digite `advpl_func` e pressione **Tab**
3. VS Code expande para a estrutura completa
4. Preencha os placeholders
5. Use **Tab** para navegar entre campos

### Exemplos de Snippets

#### Snippet 1: Criar Função (`advpl_func`)

**Digite:** `advpl_func + Tab`

```advpl
#Include "TOTVS.CH"
#Include "PROTHEUS.CH"

/*/{Protheus.doc} NomeFuncao  ← Mude aqui
Descrição breve da função    ← E aqui
...
```

**Pressione Tab para navegar entre campos:**
1. `NomeFuncao` (nome da função)
2. `Seu Nome` (seu nome)
3. `Data` (data de criação)
4. Digite sua lógica

#### Snippet 2: Criar Classe TLPP (`tlpp_class`)

**Digite:** `tlpp_class + Tab`

```tlpp
#Include "TOTVS.CH"
#Include "PROTHEUS.CH"

Namespace NomeNamespace      ← Mude aqui

/*/{Protheus.doc} NomeClasse
Descrição da classe          ← E aqui
...
```

#### Snippet 3: Report com Parâmetros (`advpl_report`)

**Digite:** `advpl_report + Tab`

```advpl
#Include "TOTVS.CH"

/*/{Protheus.doc} NomeRelatorio
Relatório de descrição
...

If !Pergunte("GRUPO", .T.)  ← Customize "GRUPO"
    Return
EndIf

Local cCodDe := mv_par01
Local cCodAte := mv_par02
...
```

#### Snippet 4: Try-Catch (`advpl_try`)

**Digite:** `advpl_try + Tab`

```advpl
Begin Sequence
    // Código aqui   ← Insira sua lógica

Except
    Local cMsg := "Erro: ..." + GetErrorMessage(GetException())
    ConOut(cMsg)

End Sequence
```

### Lista Completa de Snippets

```
advpl_func           - Função ADVPL com estrutura padrão
advpl_func_array     - Função que retorna array
tlpp_class           - Classe TLPP com namespaces
advpl_report         - Report com Pergunte()
advpl_rest           - REST API
advpl_validation     - Validação de campo
advpl_mvc            - Estrutura MVC
advpl_job            - Job de processamento
advpl_try            - Begin Sequence/Except
advpl_dbselect       - Acesso seguro a DB
```

---

## 🔄 Workflow Prático: Criar um Programa Completo

### Cenário: Criar uma função de faturamento

**Passo 1: Entender a tabela SC5 (Pedidos)**
```
Usuario: "Quais campos tem a tabela SC5?"

Copilot: [Usa SX Tool para obter estrutura]
```

**Passo 2: Gerar o código base**
```
Usuario: "Crie uma função chamada CalcularFaturamento"

Copilot: [Usa advpl_func para gerar template]
```

**Passo 3: Consultar parâmetros**
```
Usuario: "Quais parâmetros de faturamento existem?"

Copilot: [Usa SX Tool com module:Faturamento]
```

**Passo 4: Implementar lógica**
```
Usuario: "Adicione validação de estado nesta função"

Copilot: [Usa advpl_dbselect e advpl_validation]
```

---

## 💡 Dicas e Truques

### Dica 1: Busca Avançada
```
Você quer buscar TODOS os campos com "NOME"?
Use: search_fields | SA1|*NOME

VS Code: Snippets com wildcards também funcionam!
```

### Dica 2: Exportar para Documentação
```
Usuario: "Exporte todos os snippets em JSON"

Copilot: [Usa advpl_snippets action:export_json]

Resultado: JSON que pode ser processado
```

### Dica 3: Customizar Snippets
Você pode editar `.vscode/advpl-sensei.code-snippets` para:
- Adicionar seus próprios snippets
- Modificar placeholders
- Incluir mais templates

### Dica 4: Combinar com Lint
```
Workflow:
1. Gerar função com snippets (advpl_func)
2. Implementar lógica
3. Validar com lint (advpl_lint)
4. Corrigir issues
5. Pronto!
```

---

## ❓ Perguntas Frequentes

### P1: Como criar múltiplas funções rapidamente?
**R:** Use `advpl_func` para cada uma. Os snippets fazem expand automático.

### P2: Posso customizar os snippets?
**R:** Sim! Edite `.vscode/advpl-sensei.code-snippets` com seus templates.

### P3: O SX Tool cobre todas as tabelas?
**R:** Versão 1.1.4 inclui principais. Mais tabelas virão em releases futuras.

### P4: Os snippets funcionam em extensões MCP?
**R:** Sim! Copilot, Cline e Roo Code suportam VS Code snippets.

### P5: Posso exportar snippets para outro editor?
**R:** Sim! Use `export_json` e adapte para o formato do seu editor.

---

## 📚 Recursos Adicionais

### Documentação
- [SX Tool Reference](../mcp-server/commands/sx.md)
- [Snippets Reference](../mcp-server/commands/snippets.md)
- [Phase 4 Documentation](./phase-4-documentation.md)

### Arquivos
- Snippets: `.vscode/advpl-sensei.code-snippets`
- Database: Integrado em `sx-tool.ts`
- Images referência: [Ver relatório final](./FASE-4-RELATORIO-FINAL.md)

### Suporte
- Issues: Reporte problemas no GitHub
- Suggestions: Compartilhe ideias
- Contributions: Pull requests bem-vindas!

---

## 🎓 Tutorial Passo a Passo

### Tutorial: Criar Sistema de Vendas

**Objetivo:** Criar estruturas para gestão de vendas

**Tempo Estimado:** 15 minutos

#### Passo 1: Instalar Snippets (2 min)
```
1. Abra VS Code
2. Chat: "Gere snippets VS Code"
3. Aguarde confirmação
```

#### Passo 2: Criar tabela de referência (3 min)
```
1. Chat: "Quais campos tem SA1 (clientes)?"
2. Anote campos importantes
3. Crie tabela de referência
```

#### Passo 3: Criar funções (7 min)
```
1. Novo arquivo: MinhaVenda.prw
2. Digite: advpl_func + Tab
3. Nome: MinhaVenda
4. Implemente lógica
5. Repita para mais funções
```

#### Passo 4: Validar (2 min)
```
1. Validar com Lint
2. Corrigir issues
3. Está pronto!
```

---

## ✨ Benefícios Práticos

| Benefício | Impacto |
|-----------|--------|
| **Velocidade** | 60% mais rápido escrever funções |
| **Consistência** | 100% das regras de ouro |
| **Qualidade** | Menos bugs e refactoring |
| **Learning** | Novos devs aprendem padrões |
| **Referência** | Acesso instant ao dict |

---

## 🚀 Próximo Nível

Depois de dominar as ferramentas básicas:

1. **Combinar com Lint** - Validar e melhorar código
2. **Usar TDN Scraper** - Buscar info de entry points
3. **Gerar Boilerplate** - Criar estruturas automátticas
4. **Revisar Código** - Aplicar 24 regras de ouro

---

**Dúvidas?** Use o Menu de Help do Copilot para mais informações!

**Boa sorte com suas implementações!** 🎉
