/**
 * Registry Analyzer - Ferramenta para validar completude e consistência do Function Registry
 * 
 * Fase 5.3: Validação e Manutenção da Qualidade do Registry
 * 
 * Analisa:
 * 1. Consistência: todos os campos preenchidos?
 * 2. Duplicatas: funções repetidas?
 * 3. Completude: tipos, categorias, linguagens?
 * 4. Cobertura: quantas funções por tipo?
 * 5. Qualidade: sugestões de melhoria
 */

import { FUNCTION_REGISTRY, FUNCTION_CATEGORIES, FunctionDef } from "./function-registry.js";

export interface RegistryAnalysisIssue {
  function: string;
  type: "error" | "warning" | "info";
  issue: string;
  suggestion?: string;
}

export interface RegistryAnalysisReport {
  timestamp: string;
  totalFunctions: number;
  issuesFound: number;
  issues: RegistryAnalysisIssue[];
  statistics: {
    byType: Record<string, number>;
    byLanguage: Record<string, number>;
    byCategory: Record<string, number>;
    deprecated: number;
    fictitious: number;
    incomplete: number;
  };
  quality: {
    score: number; // 0-100
    level: "CRITICAL" | "LOW" | "MEDIUM" | "HIGH";
    recommendations: string[];
  };
}

export class RegistryAnalyzer {
  /**
   * Analisar registry completo
   */
  public static analyze(): RegistryAnalysisReport {
    const issues: RegistryAnalysisIssue[] = [];
    const timestamp = new Date().toISOString();

    // 1. Validar cada função
    const functionIssues = this.validateFunctions();
    issues.push(...functionIssues);

    // 2. Validar duplicatas
    const duplicateIssues = this.checkDuplicates();
    issues.push(...duplicateIssues);

    // 3. Validar categorias
    const categoryIssues = this.validateCategories();
    issues.push(...categoryIssues);

    // 4. Gerar estatísticas
    const statistics = this.generateStatistics();

    // 5. Calcular qualidade
    const quality = this.calculateQuality(issues, statistics);

    return {
      timestamp,
      totalFunctions: Object.keys(FUNCTION_REGISTRY).length,
      issuesFound: issues.length,
      issues,
      statistics,
      quality,
    };
  }

  /**
   * Validar cada função no registry
   */
  private static validateFunctions(): RegistryAnalysisIssue[] {
    const issues: RegistryAnalysisIssue[] = [];

    for (const [key, func] of Object.entries(FUNCTION_REGISTRY)) {
      // Verificar nome
      if (!func.name) {
        issues.push({
          function: key,
          type: "error",
          issue: "Campo 'name' está vazio",
          suggestion: "Adicione o nome da função",
        });
      }

      // Verificar type
      if (!func.type || !["native", "framework", "class", "object"].includes(func.type)) {
        issues.push({
          function: key,
          type: "error",
          issue: `Type inválido: '${func.type}'`,
          suggestion: "Use: native, framework, class ou object",
        });
      }

      // Verificar language
      if (!func.language || !["advpl", "tlpp", "both"].includes(func.language)) {
        issues.push({
          function: key,
          type: "error",
          issue: `Language inválido: '${func.language}'`,
          suggestion: "Use: advpl, tlpp ou both",
        });
      }

      // Verificar category
      if (!func.category) {
        issues.push({
          function: key,
          type: "error",
          issue: "Campo 'category' está vazio",
          suggestion: `Use uma das categorias conhecidas`,
        });
      } else if (!Object.keys(FUNCTION_CATEGORIES).includes(func.category)) {
        issues.push({
          function: key,
          type: "warning",
          issue: `Categoria desconhecida: '${func.category}'`,
          suggestion: `Categorias conhecidas: ${Object.keys(FUNCTION_CATEGORIES).join(", ")}`,
        });
      }

      // Verificar description
      if (!func.description || func.description.length < 10) {
        issues.push({
          function: key,
          type: "warning",
          issue: "Description muito curta ou vazia",
          suggestion: "Adicione uma descrição significativa (mín. 10 caracteres)",
        });
      }

      // Verificar signature (recomendado)
      if (!func.signature && func.type === "native") {
        issues.push({
          function: key,
          type: "info",
          issue: "Campo 'signature' não preenchido (recomendado para nativas)",
          suggestion: "Adicione exemplo de sintaxe da função",
        });
      }

      // Verificar ficção
      const isFictitious = func.name.includes("❌") || func.deprecated === true;
      if (isFictitious && func.type !== "native") {
        issues.push({
          function: key,
          type: "warning",
          issue: "Função fictícia/deprecada marcada com tipo não-nativo",
          suggestion: "Funções fictícias devem ser tipo 'native' com deprecated=true",
        });
      }
    }

    return issues;
  }

  /**
   * Verificar duplicatas (keys diferentes, mesmo name)
   */
  private static checkDuplicates(): RegistryAnalysisIssue[] {
    const issues: RegistryAnalysisIssue[] = [];
    const names = new Map<string, string[]>();

    for (const [key, func] of Object.entries(FUNCTION_REGISTRY)) {
      if (!names.has(func.name)) {
        names.set(func.name, []);
      }
      names.get(func.name)!.push(key);
    }

    // Procurar duplicatas
    for (const [name, keys] of names) {
      if (keys.length > 1) {
        issues.push({
          function: name,
          type: "error",
          issue: `Função duplicada em ${keys.length} entradas: ${keys.join(", ")}`,
          suggestion: "Remova duplicatas ou combine em uma única entrada",
        });
      }
    }

    return issues;
  }

  /**
   * Validar categorias
   */
  private static validateCategories(): RegistryAnalysisIssue[] {
    const issues: RegistryAnalysisIssue[] = [];
    const usedCategories = new Set<string>();

    for (const func of Object.values(FUNCTION_REGISTRY)) {
      if (func.category) {
        usedCategories.add(func.category);
      }
    }

    // Verificar categorias não usadas
    for (const [category] of Object.entries(FUNCTION_CATEGORIES)) {
      if (!usedCategories.has(category)) {
        issues.push({
          function: "REGISTRY",
          type: "info",
          issue: `Categoria '${category}' definida mas não usada`,
          suggestion: "Remova categorias não utilizadas ou adicione funções",
        });
      }
    }

    return issues;
  }

  /**
   * Gerar estatísticas do registry
   */
  private static generateStatistics(): RegistryAnalysisReport["statistics"] {
    const byType: Record<string, number> = {};
    const byLanguage: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let deprecated = 0;
    let fictitious = 0;
    let incomplete = 0;

    for (const func of Object.values(FUNCTION_REGISTRY)) {
      // Type
      byType[func.type] = (byType[func.type] || 0) + 1;

      // Language
      byLanguage[func.language] = (byLanguage[func.language] || 0) + 1;

      // Category
      byCategory[func.category] = (byCategory[func.category] || 0) + 1;

      // Flags
      if (func.deprecated) deprecated++;
      if (func.name.includes("❌") || func.name.includes("⚠️")) fictitious++;
      if (!func.description || !func.type) incomplete++;
    }

    return { byType, byLanguage, byCategory, deprecated, fictitious, incomplete };
  }

  /**
   * Calcular score de qualidade
   */
  private static calculateQuality(
    issues: RegistryAnalysisIssue[],
    stats: RegistryAnalysisReport["statistics"]
  ): RegistryAnalysisReport["quality"] {
    const errorCount = issues.filter((i) => i.type === "error").length;
    const warningCount = issues.filter((i) => i.type === "warning").length;
    const recommendations: string[] = [];

    // Calcular score (100 = perfeito)
    let score = 100;
    score -= errorCount * 10;
    score -= warningCount * 3;
    score -= Math.max(0, 50 - Object.keys(FUNCTION_REGISTRY).length) * 0.5; // Penalidade por funções insuficientes
    score = Math.max(0, score);

    // Determinar level
    let level: "CRITICAL" | "LOW" | "MEDIUM" | "HIGH" = "HIGH";
    if (score >= 80) level = "HIGH";
    else if (score >= 60) level = "MEDIUM";
    else if (score >= 40) level = "LOW";
    else level = "CRITICAL";

    // Gerar recomendações
    if (errorCount > 0) {
      recommendations.push(`⚠️ ${errorCount} erro(s) de consistência encontrado(s). Corrija antes de usar em produção.`);
    }

    if (Object.keys(FUNCTION_REGISTRY).length < 50) {
      recommendations.push(
        `📚 Registry tem apenas ${Object.keys(FUNCTION_REGISTRY).length} funções. Considere expandir com mais 30-40 funções Protheus comuns.`
      );
    }

    if (stats.incomplete > 0) {
      recommendations.push(`📝 ${stats.incomplete} função(s) com informações incompletas. Adicione descrições e assinaturas.`);
    }

    if (stats.fictitious > 0) {
      recommendations.push(
        `🔴 ${stats.fictitious} função(s) fictícia(s) detectada(s). Essas devem ser marcadas como deprecated.`
      );
    }

    recommendations.push(
      "💡 Para expandir o registry, consulte: TOTVS Documentation, SonarQube Rules, TDN (Tecnologia TOTVS)"
    );

    return { score: Math.round(score), level, recommendations };
  }

  /**
   * Gerar relatório em formato texto
   */
  public static generateReport(analysis: RegistryAnalysisReport): string {
    let report = `
╔════════════════════════════════════════════════════════════╗
║        Function Registry Analysis Report                  ║
╚════════════════════════════════════════════════════════════╝

📅 Timestamp: ${analysis.timestamp}
📊 Total Functions: ${analysis.totalFunctions}
🔴 Issues Found: ${analysis.issuesFound}

QUALITY SCORE
─────────────────────────────────────────────────────────────
Score: ${analysis.quality.score}/100
Level: ${this.formatLevel(analysis.quality.level)}

STATISTICS
─────────────────────────────────────────────────────────────
By Type:
`;

    for (const [type, count] of Object.entries(analysis.statistics.byType)) {
      report += `  • ${type}: ${count}\n`;
    }

    report += `\nBy Language:\n`;
    for (const [lang, count] of Object.entries(analysis.statistics.byLanguage)) {
      report += `  • ${lang}: ${count}\n`;
    }

    report += `\nBy Category:\n`;
    for (const [cat, count] of Object.entries(analysis.statistics.byCategory)) {
      report += `  • ${cat}: ${count}\n`;
    }

    report += `\nSpecial Status:
  • Deprecated: ${analysis.statistics.deprecated}
  • Fictitious: ${analysis.statistics.fictitious}
  • Incomplete: ${analysis.statistics.incomplete}

ISSUES
─────────────────────────────────────────────────────────────
`;

    if (analysis.issues.length === 0) {
      report += "✅ No issues found!\n";
    } else {
      // Agrupar por tipo
      const errors = analysis.issues.filter((i) => i.type === "error");
      const warnings = analysis.issues.filter((i) => i.type === "warning");
      const infos = analysis.issues.filter((i) => i.type === "info");

      if (errors.length > 0) {
        report += `\n🔴 ERRORS (${errors.length}):\n`;
        errors.forEach((issue) => {
          report += `  • [${issue.function}] ${issue.issue}\n`;
          if (issue.suggestion) report += `    💡 ${issue.suggestion}\n`;
        });
      }

      if (warnings.length > 0) {
        report += `\n🟡 WARNINGS (${warnings.length}):\n`;
        warnings.forEach((issue) => {
          report += `  • [${issue.function}] ${issue.issue}\n`;
          if (issue.suggestion) report += `    💡 ${issue.suggestion}\n`;
        });
      }

      if (infos.length > 0) {
        report += `\n🔵 INFO (${infos.length}):\n`;
        infos.slice(0, 5).forEach((issue) => {
          report += `  • [${issue.function}] ${issue.issue}\n`;
          if (issue.suggestion) report += `    💡 ${issue.suggestion}\n`;
        });
        if (infos.length > 5) {
          report += `  ... and ${infos.length - 5} more info messages\n`;
        }
      }
    }

    report += `\nRECOMMENDATIONS
─────────────────────────────────────────────────────────────
`;
    analysis.quality.recommendations.forEach((rec) => {
      report += `${rec}\n`;
    });

    report += `\n╔════════════════════════════════════════════════════════════╗
║                     END OF REPORT                         ║
╚════════════════════════════════════════════════════════════╝\n`;

    return report;
  }

  /**
   * Formato visual do nível
   */
  private static formatLevel(level: string): string {
    const levels: Record<string, string> = {
      HIGH: "✅ HIGH (80-100)",
      MEDIUM: "⚠️ MEDIUM (60-79)",
      LOW: "🔴 LOW (40-59)",
      CRITICAL: "❌ CRITICAL (0-39)",
    };
    return levels[level] || level;
  }

  /**
   * Exportar relatório como JSON
   */
  public static exportAsJson(analysis: RegistryAnalysisReport): string {
    return JSON.stringify(analysis, null, 2);
  }
}
