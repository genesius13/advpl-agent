# Advpl Sensei - MCP Server

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![MCP](https://img.shields.io/badge/protocol-MCP-orange)
![TOTVS](https://img.shields.io/badge/TOTVS-Protheus-orange)
![ADVPL](https://img.shields.io/badge/lang-ADVPL%20%7C%20TLPP-yellow)

Servidor **Model Context Protocol (MCP)** especializado no ecossistema **TOTVS Protheus**. Adicione inteligência avançada em **ADVPL** e **TLPP** ao seu VS Code através de assistentes como GitHub Copilot, Cline ou Roo Code.

## 🚀 Funcionalidades

### 🛠 Ferramentas (Tools)
- **Geração de Código**: Funções, Classes TLPP, MVC, REST APIs, Pontos de Entrada, TReport, Jobs e Workflow.
- **Revisão de Código**: Analise seu código com base em 24 regras de ouro (performance, segurança e boas práticas).
- **Diagnóstico**: Identifique causas de erros de compilação, runtime e locks.
- **Migração**: Converta código ADVPL procedural para TLPP orientado a objetos.
- **Scripts SX**: Gere scripts de dicionário (SX3, SIX, SX1, etc.) a partir de linguagem natural.

### 📚 Conhecimento (Resources)
- **Referência Nativa**: Documentação de 190+ funções nativas Protheus.
- **Dicionário SX**: Estrutura completa das tabelas de sistema (SX1 a SX9).
- **Funções Restritas**: Alertas em tempo real sobre o uso de funções proibidas pela TOTVS.
- **Padrões de Projeto**: Templates prontos para MVC, REST e integrações.

### 🎭 Personas (Prompts)
- **Code Generator**: Especialista em criar código limpo e performático.
- **Debugger**: Mestre em encontrar problemas complexos em logs do AppServer.
- **Process Consultant**: Consultor funcional para os principais módulos ERP.

## 📦 Instalação no VS Code

### 1. Requisitos
- Node.js v18 ou superior instalado.
- Uma extensão compatível com MCP (**GitHub Copilot**, **Cline** ou **Roo Code**).

### 2. Configuração (Local)
Clone este repositório e compile o projeto:
```bash
git clone https://github.com/thalysjuvenal/advpl-specialist.git
cd advpl-specialist/mcp-server
npm install
npm run build
```

### 3. Adicionar ao VS Code

#### No GitHub Copilot
Adicione ao seu arquivo `.vscode/mcp.json`:
```json
{
  "mcpServers": {
    "advpl-specialist": {
      "command": "node",
      "args": ["/Caminho/Para/advpl-specialist/mcp-server/dist/index.js"]
    }
  }
}
```

#### No Cline / Roo Code
Nas configurações de **MCP Servers**, adicione:
```json
{
  "mcpServers": {
    "advpl-specialist": {
      "command": "node",
      "args": ["/Caminho/Para/advpl-specialist/mcp-server/dist/index.js"]
    }
  }
}
```

## 🛠 Desenvolvimento

Para rodar em modo de desenvolvimento com hot-reload:
```bash
cd mcp-server
npm run dev
```

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
