/**
 * TDN Scraper - Extrai informações de Entry Points do TOTVS Developer Network
 */

export interface EntryPointInfo {
  name: string;
  url: string;
  parameters: Array<{
    position: number;
    type: string;
    description: string;
  }>;
  returnType: string;
  returnDescription: string;
  routine: string;
}

export class TdnScraper {
  /**
   * Busca e extrai dados de um Entry Point
   */
  public static async getEntryPoint(name: string): Promise<EntryPointInfo | null> {
    // URL de busca aproximada ou direta se possível. 
    // O TDN costuma ter URLs no formato: https://tdn.totvs.com/display/public/PROT/ENTRY_POINT_NAME
    const baseUrl = "https://tdn.totvs.com";
    const searchUrl = `${baseUrl}/display/public/PROT/${name}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        // Se não encontrar direto, talvez precise de uma busca mais complexa, 
        // mas por agora vamos focar no padrão de URL direta que é comum para EPs famosos.
        return null;
      }

      const html = await response.text();
      
      return this.parseHtml(html, name, searchUrl);
    } catch (e) {
      console.error("Erro no scraping do TDN:", e);
      return null;
    }
  }

  private static parseHtml(html: string, name: string, url: string): EntryPointInfo {
    const info: EntryPointInfo = {
      name,
      url,
      parameters: [],
      returnType: "Desconhecido",
      returnDescription: "",
      routine: "Desconhecida"
    };

    // Extração simplificada via Regex para um ambiente sem DOM completo (como o servidor MCP básico)
    // Em um cenário real, usaríamos algo como 'cheerio', mas vamos tentar manter as dependências baixas.
    
    // 1. Tentar encontrar a tabela de PARAMIXB
    // Geralmente uma tabela com cabeçalho "Ordem", "Tipo", "Descrição"
    const paramTableRegex = /<table[^>]*>[\s\S]*?PARAMIXB[\s\S]*?<\/table>/i;
    const tableMatch = html.match(paramTableRegex);
    
    if (tableMatch) {
      const rows = tableMatch[0].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      rows.forEach((row, idx) => {
        if (idx === 0) return; // Pula cabeçalho
        
        const cols = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (cols.length >= 3) {
          info.parameters.push({
            position: info.parameters.length + 1,
            type: this.cleanHtml(cols[1]),
            description: this.cleanHtml(cols[2])
          });
        }
      });
    }

    // 2. Tentar encontrar o retorno
    const returnRegex = /Retorno[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i;
    const returnMatch = html.match(returnRegex);
    if (returnMatch) {
      info.returnType = this.cleanHtml(returnMatch[1]);
    }

    // 3. Tentar encontrar a rotina
    const routineRegex = /Programa[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i;
    const routineMatch = html.match(routineRegex);
    if (routineMatch) {
      info.routine = this.cleanHtml(routineMatch[1]);
    }

    return info;
  }

  private static cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remove tags
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")    // Normaliza espaços
      .trim();
  }
}
