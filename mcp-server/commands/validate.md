# Template Validator Command

## Overview

Valida templates ADVPL/TLPP para garantir que funções usadas realmente existem e são compatíveis com a linguagem selecionada.

## Command: advpl_validate_template

Valida um template de código e retorna um relatório de erros, avisos e sugestões de correção.

### Parameters

- **code** (required): Código do template a ser validado
  - Type: string
  - Description: Conteúdo completo do template ADVPL ou TLPP
  
- **language** (optional): Linguagem alvo
  - Type: "advpl" | "tlpp" | "auto"
  - Default: "auto" (detectado automaticamente)
  - Description: Se "auto", tenta detectar a linguagem no código
  
- **filename** (optional): Nome do arquivo
  - Type: string
  - Default: "template.prw" ou "template.tlpp"
  - Description: Usado em relatórios de erro

### Response Format

```json
{
  "filename": "untitled.prw",
  "language": "advpl",
  "valid": false,
  "issues": [
    {
      "line": 10,
      "column": 25,
      "code": "FUNC_FICTITIOUS",
      "message": "Function 'HttpServer()' is fictitious or deprecated",
      "severity": "error",
      "suggestion": "This function may not exist or is deprecated. Check TOTVS SDK."
    }
  ],
  "statistics": {
    "totalLines": 45,
    "errorCount": 1,
    "warningCount": 2,
    "infoCount": 1
  }
}
```

## Validation Levels

### 🔴 ERROR (Blocker - Code will not compile)
- **FUNC_FICTITIOUS**: Função não existe ou é fictícia (ex: HttpServer)
- **FUNC_INCOMPATIBLE**: Função não compatível com linguagem (ex: JsonObject em ADVPL)
- **NO_FUNCTION**: Falta declaração de função/classe
- **MISSING_EXCEPT**: Begin Sequence sem Except
- **MISSING_END_SEQUENCE**: Begin Sequence sem End Sequence

### 🟡 WARNING (Possible issues - May cause problems)
- **FUNC_NOT_FOUND**: Função não encontrada no registry (pode ser custom)
- **NO_RETURN**: Função sem Return statement
- **MISSING_TOTVS_CH**: Falta #Include "TOTVS.CH"
- **MISSING_PROTHEUS_CH**: Falta #Include "PROTHEUS.CH" para FW classes

### 🔵 INFO (Best practices - Optional)
- **MISSING_PROTHEUS_DOC**: Falta documentação Protheus.doc

## Examples

### Example 1: Valid Code
**Request:**
```json
{
  "code": "User Function TestFunc()\nLocal nResult := 0\nReturn nResult",
  "language": "advpl"
}
```

**Response:**
```json
{
  "valid": true,
  "issues": [],
  "statistics": {
    "totalLines": 3,
    "errorCount": 0,
    "warningCount": 0,
    "infoCount": 1
  }
}
```

### Example 2: Fictitious Function
**Request:**
```json
{
  "code": "User Function RestAPI()\noHttpServer := HttpServer()\nReturn oHttpServer",
  "language": "advpl"
}
```

**Response:**
```json
{
  "valid": false,
  "issues": [
    {
      "line": 2,
      "code": "FUNC_FICTITIOUS",
      "message": "Function 'HttpServer()' is fictitious or deprecated",
      "severity": "error",
      "suggestion": "This function may not exist. Use FWRest or TLPP classes instead."
    }
  ],
  "statistics": {
    "totalLines": 3,
    "errorCount": 1,
    "warningCount": 0,
    "infoCount": 0
  }
}
```

### Example 3: Language Incompatibility
**Request:**
```json
{
  "code": "#include \"totvs.ch\"\nUser Function TestJson()\nLocal oJson := JsonObject()\nReturn oJson",
  "language": "advpl"
}
```

**Response:**
```json
{
  "valid": false,
  "issues": [
    {
      "line": 3,
      "code": "FUNC_INCOMPATIBLE",
      "message": "Function 'JsonObject()' not compatible with advpl",
      "severity": "error",
      "suggestion": "JsonObject only works with tlpp. Use TLPP classes or convert project."
    }
  ],
  "statistics": {
    "totalLines": 4,
    "errorCount": 1,
    "warningCount": 0,
    "infoCount": 0
  }
}
```

## Integration with Boilerplate Generator

Quando o usuário solicita gerar um boilerplate, o sistema:

1. **Gera o código** usando templates golden-rule
2. **Valida o código** com TemplateValidator
3. **Se válido**: Retorna o código gerado
4. **Se inválido**: Retorna erro com sugestões

```
User: "Gere uma função REST em ADVPL"
  ↓
Boilerplate Generator (creates template with REST functions)
  ↓
Template Validator (validates HttpServer, etc.)
  ↓
Result: ❌ FUNC_FICTITIOUS - HttpServer not available in ADVPL
  ↓
Suggestion: Use TLPP class FWRest instead
```

## Related Tools

- **advpl_generate**: Gera boilerplates (com validação)
- **advpl_snippets**: Gera snippets (com validação)
- **advpl_sx**: Consulta dictionary SX
- **advpl_lint**: Valida estrutura e style

## Performance

- Validação: ~5ms para templates < 500 linhas
- Registry lookup: O(1) hash table
- Regex matching: Otimizada para evitar backtracking

## Known Limitations

1. **Custom Functions**: Funções definidas pelo usuário aparecem como WARNING
   - Solução: Adicionar comentário `/// @known-function` acima da função

2. **Tipos Complexos**: Não analisa tipos de retorno ou parâmetros
   - Solução: Usar type hints em TLPP (Classes)

3. **Includes Condicionais**: Não rastreia includes condicionais (#ifdef)
   - Solução: Validar manualmente em contexto específico

## Future Enhancements

- [ ] Análise de tipo (type inference)
- [ ] Validação de parâmetros (arity checking)
- [ ] Sugestões de refactoring
- [ ] Integração com SonarQube rules
- [ ] Cache de templates validados
