/**
 * SX Tool - Consulta estruturada ao dicionário Protheus (SX tables)
 * Fase 4 - SX Tool & Snippets
 */

export interface FieldInfo {
  name: string;
  table: string;
  type: "C" | "N" | "D" | "L" | "M";
  size: number;
  decimals?: number;
  title: string;
  description: string;
  mandatory: boolean;
  picture?: string;
  validation?: string;
  f3?: string;
  browse: boolean;
  cbox?: string[];
}

export interface TableInfo {
  alias: string;
  description: string;
  fields: FieldInfo[];
}

export interface ParameterInfo {
  name: string;
  type: "C" | "N" | "D" | "L";
  description: string;
  defaultValue?: string;
  module?: string;
}

export interface GenericTableInfo {
  code: string;
  description: string;
  entries: Array<{ key: string; label: string }>;
}

/**
 * Banco de dados estruturado para o dicionário Protheus
 * Contém principais tabelas e campos do ERP
 */
const SX_DATABASE = {
  // Principais tabelas do sistema
  tables: {
    SA1: {
      alias: "SA1",
      description: "Clientes",
      fields: [
        {
          name: "A1_COD",
          table: "SA1",
          type: "C",
          size: 6,
          title: "Código",
          description: "Código do cliente",
          mandatory: true,
          picture: "@!",
          browse: true,
          f3: "SA1"
        },
        {
          name: "A1_NOME",
          table: "SA1",
          type: "C",
          size: 40,
          title: "Nome",
          description: "Razão social do cliente",
          mandatory: true,
          browse: true
        },
        {
          name: "A1_NREDUZ",
          table: "SA1",
          type: "C",
          size: 20,
          title: "Nome Reduzido",
          description: "Nome reduzido para etiquetas",
          mandatory: false,
          browse: true
        },
        {
          name: "A1_VALIDA",
          table: "SA1",
          type: "D",
          size: 8,
          title: "Data Validação",
          description: "Data de validação do cadastro",
          mandatory: false,
          picture: "@D"
        }
      ]
    },
    SA3: {
      alias: "SA3",
      description: "Vendedores",
      fields: [
        {
          name: "A3_COD",
          table: "SA3",
          type: "C",
          size: 6,
          title: "Código",
          description: "Código do vendedor",
          mandatory: true,
          browse: true,
          f3: "SA3"
        },
        {
          name: "A3_NOME",
          table: "SA3",
          type: "C",
          size: 30,
          title: "Nome",
          description: "Nome do vendedor",
          mandatory: true,
          browse: true
        },
        {
          name: "A3_EMAIL",
          table: "SA3",
          type: "C",
          size: 50,
          title: "Email",
          description: "Email do vendedor",
          mandatory: false
        }
      ]
    },
    SC5: {
      alias: "SC5",
      description: "Pedidos de Vendas",
      fields: [
        {
          name: "C5_NUM",
          table: "SC5",
          type: "C",
          size: 6,
          title: "Número",
          description: "Número do pedido de venda",
          mandatory: true,
          browse: true,
          picture: "@!"
        },
        {
          name: "C5_CLIENTE",
          table: "SC5",
          type: "C",
          size: 6,
          title: "Cliente",
          description: "Código do cliente",
          mandatory: true,
          f3: "SA1"
        },
        {
          name: "C5_LOJA",
          table: "SC5",
          type: "C",
          size: 2,
          title: "Loja",
          description: "Loja do cliente",
          mandatory: true
        }
      ]
    },
    SX3: {
      alias: "SX3",
      description: "Dicionário de Campos",
      fields: [
        {
          name: "X3_ARQUIVO",
          table: "SX3",
          type: "C",
          size: 10,
          title: "Arquivo",
          description: "Alias da tabela",
          mandatory: true,
          browse: true
        },
        {
          name: "X3_CAMPO",
          table: "SX3",
          type: "C",
          size: 10,
          title: "Campo",
          description: "Nome do campo",
          mandatory: true,
          browse: true
        },
        {
          name: "X3_TIPO",
          table: "SX3",
          type: "C",
          size: 1,
          title: "Tipo",
          description: "Tipo de dado (C/N/D/L/M)",
          mandatory: true,
          cbox: ["C", "N", "D", "L", "M"]
        }
      ]
    }
  },

  // Parâmetros do sistema (MV_*)
  parameters: {
    MV_ESTADO: {
      name: "MV_ESTADO",
      type: "C",
      description: "Estado padrão da empresa",
      defaultValue: "SP",
      module: "Geral"
    },
    MV_MOEDA1: {
      name: "MV_MOEDA1",
      type: "N",
      description: "Moeda padrão",
      defaultValue: "1",
      module: "Financeiro"
    },
    MV_JUROS: {
      name: "MV_JUROS",
      type: "N",
      description: "Taxa de juros padrão",
      defaultValue: "0",
      module: "Financeiro"
    },
    MV_MULTA: {
      name: "MV_MULTA",
      type: "N",
      description: "Multa padrão para atraso",
      defaultValue: "0",
      module: "Financeiro"
    },
    MV_USARFT: {
      name: "MV_USARFT",
      type: "C",
      description: "Usar FT (Faturamento)",
      defaultValue: "N",
      module: "Faturamento"
    }
  },

  // Tabelas genéricas (SX5)
  genericTables: {
    "01": {
      code: "01",
      description: "Condições de Pagamento",
      entries: [
        { key: "001", label: "À Vista" },
        { key: "002", label: "A Prazo" },
        { key: "003", label: "Parcelado" }
      ]
    },
    "13": {
      code: "13",
      description: "Estados/Províncias",
      entries: [
        { key: "AC", label: "Acre" },
        { key: "AL", label: "Alagoas" },
        { key: "SP", label: "São Paulo" },
        { key: "RJ", label: "Rio de Janeiro" }
      ]
    },
    "AB": {
      code: "AB",
      description: "Possíveis UF",
      entries: [
        { key: "SP", label: "São Paulo" },
        { key: "MG", label: "Minas Gerais" },
        { key: "RJ", label: "Rio de Janeiro" }
      ]
    }
  }
};

export class SXTool {
  /**
   * Busca informações de uma tabela específica
   */
  public static getTable(alias: string): TableInfo | null {
    const table = (SX_DATABASE.tables as any)[alias];
    return table || null;
  }

  /**
   * Busca informações de um campo específico
   */
  public static getField(table: string, fieldName: string): FieldInfo | null {
    const tableData = (SX_DATABASE.tables as any)[table];
    if (!tableData) return null;

    return tableData.fields.find((f: FieldInfo) => f.name === fieldName) || null;
  }

  /**
   * Lista todos os campos de uma tabela
   */
  public static getTableFields(alias: string): FieldInfo[] {
    const table = (SX_DATABASE.tables as any)[alias];
    return table?.fields || [];
  }

  /**
   * Busca um parâmetro do sistema
   */
  public static getParameter(paramName: string): ParameterInfo | null {
    const param = (SX_DATABASE.parameters as any)[paramName];
    return param || null;
  }

  /**
   * Lista todos os parâmetros
   */
  public static getAllParameters(): ParameterInfo[] {
    return Object.values(SX_DATABASE.parameters as any);
  }

  /**
   * Busca uma tabela genérica (SX5)
   */
  public static getGenericTable(code: string): GenericTableInfo | null {
    const table = (SX_DATABASE.genericTables as any)[code];
    return table || null;
  }

  /**
   * Lista todas as tabelas disponíveis
   */
  public static getAllTables(): Array<{ alias: string; description: string }> {
    return Object.keys(SX_DATABASE.tables).map((alias) => ({
      alias,
      description: (SX_DATABASE.tables as any)[alias].description
    }));
  }

  /**
   * Busca por padrão (wildcards)
   * Ex: searchFields("SA1", "*COD") retorna campos contendo "COD"
   */
  public static searchFields(table: string, pattern: string): FieldInfo[] {
    const tableData = (SX_DATABASE.tables as any)[table];
    if (!tableData) return [];

    const regex = new RegExp(pattern.replace(/\*/g, ".*"), "i");
    return tableData.fields.filter((f: FieldInfo) => regex.test(f.name));
  }

  /**
   * Retorna data do dicionário em formato JSON estruturado
   */
  public static exportAsJson(type: "tables" | "parameters" | "generics" = "tables"): string {
    let data: any;

    switch (type) {
      case "tables":
        data = SX_DATABASE.tables;
        break;
      case "parameters":
        data = SX_DATABASE.parameters;
        break;
      case "generics":
        data = SX_DATABASE.genericTables;
        break;
      default:
        data = SX_DATABASE;
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Gera um resumo formatado para apresentação
   */
  public static formatTableSummary(alias: string): string {
    const table = this.getTable(alias);
    if (!table) return `Tabela '${alias}' não encontrada.`;

    let summary = `# Tabela: ${table.alias}\n`;
    summary += `**Descrição:** ${table.description}\n\n`;
    summary += `## Campos (${table.fields.length})\n\n`;

    table.fields.forEach((field) => {
      summary += `### ${field.name}\n`;
      summary += `- **Tipo:** ${field.type}(${field.size}`;
      if (field.decimals) summary += `,${field.decimals}`;
      summary += `)\n`;
      summary += `- **Descrição:** ${field.description}\n`;
      summary += `- **Obrigatório:** ${field.mandatory ? "Sim" : "Não"}\n`;
      if (field.f3) summary += `- **F3:** ${field.f3}\n`;
      if (field.picture) summary += `- **Picture:** ${field.picture}\n`;
      summary += "\n";
    });

    return summary;
  }

  /**
   * Gera um resumo formatado de parâmetros por módulo
   */
  public static formatParametersByModule(module?: string): string {
    const params = Object.values(SX_DATABASE.parameters as any) as ParameterInfo[];
    const filtered = module
      ? params.filter((p) => p.module === module)
      : params;

    if (filtered.length === 0) {
      return `Nenhum parâmetro encontrado${module ? ` para o módulo '${module}'` : ""}.`;
    }

    let summary = `${module ? `Parâmetros do Módulo: ${module}` : "Todos os Parâmetros"}\n\n`;

    filtered.forEach((param) => {
      summary += `- **${param.name}** (${param.type}): ${param.description}\n`;
      if (param.defaultValue) summary += `  Padrão: \`${param.defaultValue}\`\n`;
      summary += "\n";
    });

    return summary;
  }
}
