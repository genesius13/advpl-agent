---
name: SX Tool
description: Consulta estruturada ao dicionário Protheus (SX tables). Busque tabelas, campos, parâmetros do sistema e tabelas genéricas.
parameters:
  action:
    type: string
    description: "Ação a executar: list_tables, get_table, search_fields, get_parameters, get_generic_table, export"
    required: true
  query:
    type: string
    description: "Parâmetro da consulta (nome da tabela, padrão de busca, código de parâmetro, etc)"
    required: false
  format:
    type: string
    description: "Formato de resposta: markdown ou json (padrão: markdown)"
    required: false
---

# SX Tool - Consulta ao Dicionário Protheus

Ferramenta especializada em fornecer acesso rápido e estruturado ao dicionário de dados Protheus (tabelas SX).

## Funcionalidades

### 1. **list_tables** - Lista todas as tabelas
Exibe todas as tabelas disponíveis com suas descrições

**Exemplo de uso:**
```
action: list_tables
```

### 2. **get_table** - Obtém detalhes de uma tabela
Retorna a estrutura completa de uma tabela com todos os campos

**Exemplo de uso:**
```
action: get_table
query: SA1
```

### 3. **search_fields** - Busca campos por padrão
Busca campos em uma tabela usando wildcards (*)

**Exemplo de uso:**
```
action: search_fields
query: SA1|*COD
```
Busca todos os campos contendo "COD" na tabela SA1

### 4. **get_parameters** - Lista parâmetros do sistema
Retorna parâmetros MV_* organizados por módulo

**Exemplo de uso:**
```
action: get_parameters
query: Financeiro
```

### 5. **get_generic_table** - Consulta tabelas genéricas (SX5)
Retorna valores de uma tabela genérica com códigos e descrições

**Exemplo de uso:**
```
action: get_generic_table
query: 13
```

### 6. **export** - Exporta dados em JSON
Exporta os dados do dicionário em formato JSON

**Exemplo de uso:**
```
action: export
query: tables
```

## Tabelas Disponíveis para Consulta

- **SA1** - Clientes
- **SA3** - Vendedores
- **SC5** - Pedidos de Vendas
- **SX3** - Dicionário de Campos

## Tabelas Genéricas (SX5)

- **01** - Condições de Pagamento
- **13** - Estados/Províncias
- **AB** - Possíveis UF

## Parâmetros por Módulo

- Geral: MV_ESTADO
- Financeiro: MV_MOEDA1, MV_JUROS, MV_MULTA
- Faturamento: MV_USARFT

## Exemplo de Fluxo

1. Usuário: "Quais são os campos da tabela SA1?"
   - SX Tool executa: `get_table | SA1`
   - Retorna estrutura completa com tipos, tamanhos e descrições

2. Usuário: "Como validar um estado?"
   - SX Tool executa: `get_generic_table | 13`
   - Retorna lista de estados válidos

3. Usuário: "Qual é a taxa de juros padrão?"
   - SX Tool executa: `get_parameters | Financeiro`
   - Retorna valor do parâmetro MV_JUROS
