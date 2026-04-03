/**
 * Sensei Linter - Validador de regras de ouro para ADVPL/TLPP
 * 
 * Phase 5: Integração com Function Registry para validação de funções
 */

import { FunctionValidator } from "./function-registry.js";

export interface LintIssue {
  line: number;
  column: number;
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface LintResult {
  file: string;
  issues: LintIssue[];
}

export class SenseiLinter {
  /**
   * Analisa o código fonte e retorna uma lista de problemas encontrados.
   */
  public static lint(content: string, fileName: string): LintResult {
    const issues: LintIssue[] = [];
    const lines = content.split(/\r?\n/);
    
    let inFunction = false;
    let foundExecutableCode = false;
    let currentFunctionLine = 0;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();
      const upperLine = trimmedLine.toUpperCase();

      // Ignora comentários e linhas vazias
      if (!trimmedLine || trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*")) {
        return;
      }

      // Detecta início de função
      if (upperLine.startsWith("USER FUNCTION") || upperLine.startsWith("STATIC FUNCTION") || upperLine.startsWith("FUNCTION")) {
        inFunction = true;
        foundExecutableCode = false;
        currentFunctionLine = lineNum;
        return;
      }

      if (inFunction) {
        // Detecta declarações de variáveis
        if (upperLine.startsWith("LOCAL ")) {
          // Regra L001: Local deve estar antes de código executável
          if (foundExecutableCode) {
            issues.push({
              line: lineNum,
              column: 1,
              code: "L001",
              message: "Variáveis 'Local' devem ser declaradas no topo da função, antes de qualquer código executável.",
              severity: "error"
            });
          }

          // Regra L003: Notação Húngara básica
          const varsMatch = trimmedLine.substring(6).split(",");
          varsMatch.forEach(v => {
            const varName = v.trim().split(":=")[0].split("=")[0].trim();
            if (varName && !/^[cnlaodbwih]{1}[A-Z0-9_]/i.test(varName)) {
               // Algumas exceções comuns como 'self' ou variáveis curtas em loops (i, j, n)
               if (!["I", "J", "N", "X", "Y"].includes(varName.toUpperCase())) {
                issues.push({
                  line: lineNum,
                  column: line.indexOf(varName) + 1,
                  code: "L003",
                  message: `A variável '${varName}' não segue a notação húngara (ex: cNome, nValor).`,
                  severity: "warning"
                });
               }
            }
          });
        } 
        // Regra L002: Proibido Private ou Public
        else if (upperLine.startsWith("PRIVATE ") || upperLine.startsWith("PUBLIC ")) {
          issues.push({
            line: lineNum,
            column: 1,
            code: "L002",
            message: "Uso de variáveis 'Private' ou 'Public' é proibido em novos desenvolvimentos. Utilize 'Local' ou passgem de parâmetros.",
            severity: "error"
          });
        }
        // Detecta código executável (atribuições, chamadas de função, etc.)
        else if (trimmedLine && !upperLine.startsWith("BEGIN SEQUENCE") && !upperLine.startsWith("RETURN")) {
          // Se não é declaração nem retorno/controle, é código executável
          if (!upperLine.startsWith("#") && !upperLine.startsWith("STATIC") && !upperLine.startsWith("USER")) {
             foundExecutableCode = true;
          }
        }

        // Fim da função (aproximado, pois o ADVPL não tem 'end function' obrigatório sempre)
        if (upperLine.startsWith("RETURN")) {
          inFunction = false;
        }
      }
    });

    // Phase 5: Adicionar validação de funções fictícias
    const functionIssues = this.validateFunctionCalls(content, fileName);
    issues.push(...functionIssues);

    return { file: fileName, issues };
  }

  /**
   * Phase 5: Valida chamadas de função contra o registry
   * Detecta funções fictícias e incompatibilidades de linguagem
   */
  private static validateFunctionCalls(content: string, fileName: string): LintIssue[] {
    const issues: LintIssue[] = [];
    const lines = content.split(/\r?\n/);
    
    // Detectar linguagem do arquivo
    const isAdvpl = fileName.endsWith(".prw") || !fileName.endsWith(".tlpp");
    const language = isAdvpl ? "advpl" : "tlpp";
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Skip comments
      if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
        return;
      }

      // Regex para encontrar chamadas de função: NomeFuncao()
      const functionCallRegex = /\b([A-Za-z_]\w*)\s*\(/g;
      let match;

      while ((match = functionCallRegex.exec(line)) !== null) {
        const funcName = match[1];

        // Skip keywords
        if (["if", "while", "for", "switch", "case", "return", "local", "static", "function", "class", "method", "public", "private", "protected"].includes(funcName.toLowerCase())) {
          continue;
        }

        // Check if function is fictitious
        if (FunctionValidator.isFictitious(funcName)) {
          issues.push({
            line: lineNum,
            column: match.index + 1,
            code: "L005",
            message: `Function '${funcName}()' is fictitious or deprecated. This function may not exist in Protheus.`,
            severity: "error"
          });
        } 
        // Check language compatibility
        else if (!FunctionValidator.isCompatibleWith(funcName, language)) {
          issues.push({
            line: lineNum,
            column: match.index + 1,
            code: "L006",
            message: `Function '${funcName}()' is not compatible with ${language}. Available only in different language/module.`,
            severity: "error"
          });
        }
      }
    });

    return issues;
  }
}
