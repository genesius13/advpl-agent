# Phase 4 Implementation - SX Tool & Snippets

**Status:** ✅ Completed  
**Date:** April 2, 2026  
**Version:** 1.1.4

---

## Overview

Phase 4 implemented two critical features for the Advpl Sensei MCP Server:

1. **SX Tool** - Structured access to the Protheus dictionary
2. **Snippets Generator** - Code templates for VS Code following Sensei's golden rules

These tools complete the **automation and productivity layer** of the Advpl Sensei project.

---

## 1. SX Tool - Dictionary Access

### File: `mcp-server/src/sx-tool.ts`

**Purpose:** Provide programmatic, structured access to the Protheus data dictionary (SX tables) without needing to access markdown files.

### Features Implemented

#### 1.1 Table Information
- **Method:** `getTable(alias)` - Get complete table structure
- **Returns:** `TableInfo` with all fields and metadata
- **Use Case:** "What fields does SA1 have?"

```typescript
const table = SXTool.getTable("SA1");
// Returns: TableInfo with all fields
```

#### 1.2 Field Search
- **Method:** `getField(table, fieldName)` - Get specific field
- **Method:** `searchFields(table, pattern)` - Wildcard search with regex
- **Use Case:** "Find all COD fields in SA1"

```typescript
const fields = SXTool.searchFields("SA1", "*COD");
// Returns: Array of FieldInfo matching pattern
```

#### 1.3 System Parameters
- **Method:** `getParameter(paramName)` - Get MV_* parameter
- **Method:** `getAllParameters()` - List all parameters
- **Method:** `formatParametersByModule(module)` - Filter by module
- **Use Case:** "What's the default state and interest rate?"

```typescript
const taxRate = SXTool.getParameter("MV_JUROS");
const allParams = SXTool.formatParametersByModule("Financeiro");
```

#### 1.4 Generic Lookup Tables (SX5)
- **Method:** `getGenericTable(code)` - Get SX5 lookup table
- **Use Case:** "What are valid payment condition codes?"

```typescript
const conditions = SXTool.getGenericTable("01");
// Returns: GenericTableInfo with entries
```

#### 1.5 Data Export
- **Method:** `exportAsJson(type)` - Export to JSON format
- **Formats:** tables, parameters, or generics
- **Use Case:** Programmatic integration or docs generation

### Database Structure

The SX database includes:

**Tables:**
- `SA1` - Customers (with fields: A1_COD, A1_NOME, A1_NREDUZ, A1_VALIDA)
- `SA3` - Vendors (with fields: A3_COD, A3_NOME, A3_EMAIL)
- `SC5` - Sales Orders (with fields: C5_NUM, C5_CLIENTE, C5_LOJA)
- `SX3` - Field Dictionary (with fields: X3_ARQUIVO, X3_CAMPO, X3_TIPO)

**Parameters (MV_*):**
- Geral: `MV_ESTADO`
- Financeiro: `MV_MOEDA1`, `MV_JUROS`, `MV_MULTA`
- Faturamento: `MV_USARFT`

**Generic Tables (SX5):**
- `01` - Payment Conditions
- `13` - States/Provinces
- `AB` - Valid UF

### API: `advpl_sx` Tool

**Command Definition:** `mcp-server/commands/sx.md`

**Actions:**
- `list_tables` - List all available tables
- `get_table [query]` - Get table structure
- `search_fields [query]` - Search fields by pattern (syntax: `TABLE|PATTERN`)
- `get_parameters [module]` - List parameters, optionally filtered by module
- `get_generic_table [code]` - Get generic lookup table
- `export [type]` - Export to JSON (types: tables, parameters, generics)

**Examples:**

```
// List all tables
advpl_sx action:list_tables

// Get SA1 structure
advpl_sx action:get_table query:SA1

// Search for COD fields in SA1
advpl_sx action:search_fields query:SA1|*COD

// Get Financeiro parameters
advpl_sx action:get_parameters query:Financeiro

// Get payment conditions
advpl_sx action:get_generic_table query:01

// Export all tables as JSON
advpl_sx action:export query:tables
```

---

## 2. Snippets Generator - Code Templates

### File: `mcp-server/src/snippets-generator.ts`

**Purpose:** Generate VS Code snippets that enforce Sensei's golden rules and accelerate code writing.

### Features Implemented

#### 2.1 Snippet Templates (10 total)

1. **`advpl_func`** - ADVPL function with standard structure
   - Includes: Protheus.doc, Begin Sequence, Locals at top
   - Output: 28 lines of boilerplate

2. **`advpl_func_array`** - Function returning array
   - Use: When function should return array
   - Includes: Array declaration and population

3. **`tlpp_class`** - TLPP class with namespace
   - Includes: Namespace, constructor, method
   - Modern: OOP structure with Data properties

4. **`advpl_report`** - Report with Pergunte() parameters
   - Use: For reports with user parameters
   - Includes: Pergunte call and mv_par handling

5. **`advpl_rest`** - REST API template
   - Includes: JsonObject, status/message/data fields
   - Includes: Exception handling for API responses

6. **`advpl_validation`** - Field validation function
   - Use: For X3_VALID expressions
   - Includes: Length checks, error alerts, try-catch

7. **`advpl_mvc`** - MVC (Model-View-Controller) structure
   - Includes: FWMBrowse with basic buttons
   - Use: For maintenance routines

8. **`advpl_job`** - Batch processing job
   - Includes: DbSelectArea, loop, counter
   - Use: For scheduled jobs or background processing

9. **`advpl_try_catch`** - Begin Sequence...Except pattern
   - Minimal boilerplate for error handling
   - Use: Inline error handling

10. **`advpl_db_select`** - Safe database area access
    - Includes: GetArea/RestArea pattern
    - Use: Preserve database state

#### 2.2 Generation Methods

- **`generateSnippets()`** - Returns all snippets as object
- **`exportAsJson()`** - Export to JSON format
- **`generateVscodeSnippetsFile()`** - Generate `.code-snippets` file
- **`generateMarkdownReference()`** - Export documentation

#### 2.3 Golden Rules Enforced

✅ Correct includes (`#Include "TOTVS.CH"`)  
✅ Protheus.doc header with metadata  
✅ Begin Sequence...Except for error handling  
✅ Locals at top of function  
✅ Hungarian notation (n=numeric, c=char, l=logical, a=array)  
✅ RestArea for data preservation  
✅ No Privates (only Data for TLPP)  

### API: `advpl_snippets` Tool

**Command Definition:** `mcp-server/commands/snippets.md`

**Actions:**
- `list` - List all available snippets
- `generate_vscode [output]` - Generate `.code-snippets` file for VS Code
- `export_json` - Export as JSON
- `export_markdown` - Export as Markdown documentation

**Examples:**

```
// List snippets
advpl_snippets action:list

// Generate VS Code snippets file
advpl_snippets action:generate_vscode output:.vscode/advpl-sensei.code-snippets

// Export as JSON
advpl_snippets action:export_json

// Export as Markdown documentation
advpl_snippets action:export_markdown
```

### VS Code Integration

#### Installation

After running `advpl_snippets action:generate_vscode`, you have:
- File: `.vscode/advpl-sensei.code-snippets`
- Ready for use in VS Code

#### Usage

1. **Type snippet prefix** (e.g., `advpl_func`)
2. **Press Tab** to expand
3. **Fill placeholders** (marked with `${1:text}`, `${2:text}`, etc.)
4. **Use Tab** to navigate between placeholders

#### Example Workflow

```
Type:     advpl_func [Tab]
Expands:  Full function template with Protheus.doc
Focus:    ${1:NomeFuncao} (highlighted for editing)
Enter:    MyFunction
Tab:      Jump to ${2:Seu Nome}
Enter:    Neto Almanca
Tab:      Jump to ${3:Data}
...
Result:   Complete function with all fields filled
```

---

## 3. Index.ts Updates

### Changes Made

1. **Imports Added:**
   - `import { SXTool } from "./sx-tool.js";`
   - `import { SnippetsGenerator } from "./snippets-generator.js";`

2. **Version Updated:** `1.1.2` → `1.1.4`

3. **Tool Handlers Added:**
   - `advpl_sx` - 127 lines of implementation
   - `advpl_snippets` - 61 lines of implementation

4. **Handler Logic:**
   - Real execution instead of simulations
   - Error handling for missing parameters
   - Support for multiple output formats
   - File generation with directory creation

---

## 4. Command Definitions

### `sx.md`
- **Location:** `mcp-server/commands/sx.md`
- **Size:** 180 lines
- **Includes:** 6 actions with examples
- **Frontmatter:** Parameters schema

### `snippets.md`
- **Location:** `mcp-server/commands/snippets.md`
- **Size:** 250 lines
- **Includes:** 4 actions with examples
- **Frontmatter:** Parameters schema
- **Bonus:** Full snippets reference in Markdown

---

## 5. Testing & Validation

### Compilation
✅ TypeScript → JavaScript build successful  
✅ No compilation errors  
✅ All modules resolve correctly  

### Integration
✅ Tools registered in MCP server  
✅ Handlers connected to CallToolRequestSchema  
✅ Parameters parsed correctly from commands  

### Features Tested
- [x] Table lookup operations
- [x] Field search with wildcards
- [x] Parameter retrieval
- [x] Generic table access
- [x] JSON export
- [x] Snippet generation
- [x] VS Code file creation
- [x] Markdown export

---

## 6. Future Enhancements

### Potential Improvements

1. **Database Expansion**
   - Add more tables (SF2, SF4, SH1, etc.)
   - Include Fiscal module tables
   - Support for custom tables (Z* prefix)

2. **SX Tool Features**
   - Full-text search across descriptions
   - Field dependency tracking
   - Trigger mapping
   - F3 lookup code resolution

3. **Snippets Enhancement**
   - Region-specific snippets
   - Module-specific templates (FAT, COM, FIN, etc.)
   - Dynamic placeholders based on selected table
   - Snippet versioning and updates

4. **Integration Features**
   - Generate SX3/SIX scripts from snippets
   - Export snippets to other editors (VS, Sublime, etc.)
   - Share snippet sets across teams
   - Version control for custom snippets

5. **Documentation**
   - Inline comments in templates
   - VS Code hover documentation
   - Tutorial walkthroughs in Markdown

---

## 7. Files Summary

### New Files
- `mcp-server/src/sx-tool.ts` (445 lines)
- `mcp-server/src/snippets-generator.ts` (520 lines)
- `mcp-server/commands/sx.md` (180 lines)
- `mcp-server/commands/snippets.md` (250 lines)

### Modified Files
- `mcp-server/src/index.ts` (+210 lines for handlers)
- `mcp-server/package.json` (version bump 1.1.2 → 1.1.4)
- `CHANGELOG.md` (entry added for 1.1.4)

### Total Lines Added
- **Source Code:** 965 lines
- **Commands:** 430 lines
- **Configuration:** 2 lines
- **Total:** ~1,400 lines

---

## 8. Version History

- **1.0.7** (Mar 30, 2026) - Initial release as Claude Code plugin
- **1.1.0** (Apr 1, 2026) - MCP Server transition
- **1.1.2** (Apr 2, 2026) - Phases 1-3 (Linter, Boilerplate, TDN Scraper)
- **1.1.4** (Apr 2, 2026) - Phase 4 (SX Tool & Snippets) ✅

---

## 9. Conclusion

Phase 4 successfully implements the **SX Tool** and **Snippets Generator**, completing the automation and productivity layer of Advpl Sensei. These tools:

- **Reduce Development Time** - Templates automate boilerplate code writing
- **Ensure Consistency** - Enforce golden rules across the project
- **Accelerate Learning** - New developers learn patterns through snippets
- **Provide Reference** - Dictionary access serves as documentation
- **Enable Integration** - JSON exports allow programmatic use

The project is now **feature-complete for the planned roadmap** (Phases 1-4) and ready for:
- Production deployment
- Community contribution
- Advanced features in future versions

---

**Next Steps:**
- User feedback and optimization
- Community contributions and plugin development
- Market adoption through VS Code Marketplace
- Advanced features based on user requests
