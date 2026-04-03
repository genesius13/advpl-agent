---
description: Valida o código ADVPL/TLPP seguindo as regras de ouro do Sensei (Locals no topo, Notação Húngara, sem Privates)
parameters:
  source:
    type: string
    description: "Código fonte ADVPL/TLPP para validar"
  filename:
    type: string
    description: "Nome do arquivo (opcional)"
    required: false
---

# /advpl-sensei:lint

Valida o código fonte fornecido contra as regras de ouro do Advpl Sensei.

## Regras Verificadas

| Código | Regra | Severidade |
|--------|-------|------------|
| `L001` | Variáveis `Local` no topo da função | Erro |
| `L002` | Proibido uso de `Private` ou `Public` | Erro |
| `L003` | Notação Húngara obrigatória | Aviso |

## Uso

Forneça o código fonte completo ou parcial para análise.
