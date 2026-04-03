---
name: Snippets Generator
description: Gera snippets VS Code baseado nas regras de ouro do Sensei. Facilita a escrita de código ADVPL/TLPP seguindo os padrões.
parameters:
  action:
    type: string
    description: "Ação a executar: list, generate_vscode, export_json, export_markdown"
    required: true
  output:
    type: string
    description: "Caminho de saída para o arquivo de snippets (opcional)"
    required: false
  outputDir:
    type: string
    description: "Diretório para salvar o arquivo (padrão: diretório atual)"
    required: false
---

# Snippets Generator - Templates para VS Code

Gerador de snippets VS Code que facilitam a escrita de código ADVPL/TLPP seguindo as regras de ouro do Sensei.

## Funcionalidades

### 1. **list** - Lista todos os snippets disponíveis
Exibe todos os snippets com seus prefixos e descrições

**Exemplo:**
```
action: list
```

**Snippets Disponíveis:**

- `advpl_func` - Função ADVPL com estrutura padrão
- `advpl_func_array` - Função que retorna array
- `tlpp_class` - Classe TLPP com namespaces
- `advpl_report` - Report com Pergunte() para parâmetros
- `advpl_rest` - REST API ADVPL
- `advpl_validation` - Função de validação
- `advpl_mvc` - Estrutura MVC
- `advpl_job` - Job de processamento
- `advpl_try_catch` - Begin Sequence/Except padrão
- `advpl_db_select` - Acesso seguro a área de dados

### 2. **generate_vscode** - Gera arquivo de snippets para VS Code
Cria o arquivo `.code-snippets` na estrutura do projeto

**Exemplo:**
```
action: generate_vscode
output: .vscode/advpl-sensei.code-snippets
outputDir: /path/to/project
```

Resultado: Cria arquivo JSON pronto para usar como snippets globais do VS Code

### 3. **export_json** - Exporta snippets em JSON
Exporta todos os snippets em formato JSON

**Exemplo:**
```
action: export_json
```

### 4. **export_markdown** - Exporta referência em Markdown
Gera documentação Markdown com todos os snippets

**Exemplo:**
```
action: export_markdown
```

## Estrutura dos Snippets

Todos os snippets seguem estas regras de ouro do Sensei:

✅ **Includes corretos** - `#Include "TOTVS.CH"` e `#Include "PROTHEUS.CH"`
✅ **Protheus.doc header** - Documentação padrão
✅ **Begin Sequence com tratamento de erro** - Tratamento de exceções
✅ **Locals no topo** - Variáveis declaradas corretamente
✅ **Notação Húngara** - Nomenclatura de variáveis
✅ **RestArea** - Preservação de área de dados

## Exemplos de Uso

### Snippet: `advpl_func`
Função completa com estrutura padrão

```advpl
#Include "TOTVS.CH"
#Include "PROTHEUS.CH"

/*/{Protheus.doc} NomeFuncao
Descrição breve da função
@type function
@author Seu Nome
@since Data
@version 1.0
/*/
User Function NomeFuncao()
    // Declarações de variáveis locais
    Local nRetorno := 0
    Local cMsg := ""
    Local aArea := GetArea()

    Begin Sequence
        // Lógica da função aqui
        
    Except
        cMsg := "Erro em NomeFuncao: " + AllTrim(OldNotation(GetErrorMessage(GetException())))
        ConOut(cMsg)
        nRetorno := 0

    End Sequence

    RestArea(aArea)
Return nRetorno
```

### Snippet: `tlpp_class`
Classe TLPP com namespace e métodos

```tlpp
#Include "TOTVS.CH"
#Include "PROTHEUS.CH"

Namespace NomeNamespace

/*/{Protheus.doc} NomeClasse
Descrição da classe
@type class
@author Seu Nome
@since Data
@version 1.0
/*/
Class NomeClasse
    Data cPropriedade := ""
    Data nValor := 0
    
    Method New() Constructor
    Method Execute() As Logical
EndClass

Method New() Class NomeClasse
    ::cPropriedade := ""
    ::nValor := 0
Return Self

Method Execute() As Logical Class NomeClasse
    Local lRetorno := .T.
    Local cMsg := ""

    Begin Sequence
        // Implementação aqui
        
    Except
        cMsg := "Erro em Execute: " + AllTrim(OldNotation(GetErrorMessage(GetException())))
        ConOut(cMsg)
        lRetorno := .F.

    End Sequence

Return lRetorno

EndClass

End Namespace
```

## Como Usar no VS Code

### 1. **Gerar e instalar os snippets**
```
Ação: generate_vscode
Output: .vscode/advpl-sensei.code-snippets
```

### 2. **Usar um snippet**
- Abra um arquivo `.prw` ou `.tlpp`
- Digite o prefixo (ex: `advpl_func`)
- Pressione Tab ou Enter para expandir
- Preencha os placeholders (${1:texto}, ${2:texto}, etc)

### 3. **Exemplo prático**
1. Digite `advpl_func` e pressione Tab
2. VS Code expande para a estrutura completa
3. Seu nome fica destacado para preenchimento
4. Pressione Tab para ir para próximo placeholder
5. Continue até completar todos os campos

## Benefícios

✨ **Consistência** - Garante uso das regras de ouro em todo projeto
📝 **Agilidade** - Economiza tempo na escrita de boilerplate
🎓 **Educação** - Demonstra padrões corretos para novos desenvolvedores
🔍 **Rastreabilidade** - Facilita análise e linting de código

## Customização

Para adicionar novos snippets ou modificar existentes:

1. Mantenha a estrutura de Begin Sequence...Except
2. Use Notação Húngara em variáveis
3. Inclua Protheus.doc header
4. Adicione RestArea para preservar área de dados
5. Siga as convenções de naming do Sensei
