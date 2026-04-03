---
description: Busca informações técnicas detalhadas sobre um Entry Point (Ponto de Entrada) diretamente no TDN da TOTVS
parameters:
  name:
    type: string
    description: "Nome do Entry Point (ex: MT100LOK, MATA010, etc.)"
---

# /advpl-sensei:entrypoint

Busca a documentação oficial do Entry Point no TOTVS Developer Network (TDN) e retorna os parâmetros `PARAMIXB`, tipos de retorno e rotinas envolvidas.

## O que esta ferramenta retorna:

- **PARAMIXB**: Lista detalhada de todos os parâmetros recebidos.
- **Return Type**: Qual o tipo de retorno esperado pelo sistema.
- **Routine**: Qual programa padrão aciona este ponto de entrada.
- **URL**: Link oficial para conferência.

## Uso

```bash
/advpl-sensei:entrypoint MT100LOK
```

Esta ferramenta é essencial antes de gerar código para pontos de entrada, garantindo que a assinatura da função esteja correta de acordo com a versão atual do Protheus.
