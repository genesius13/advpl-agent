# Changelog

All notable changes to this project will be documented in this file.

## [1.1.5] - 2026-04-03

**🎯 Status:** Fully Functional | **📊 Tests:** 21/21 ✅ | **📚 Docs:** Complete

### Added

#### Phase 5.1: Function Registry & Validation
- `mcp-server/src/function-registry.ts` (650+ lines)
  - Database of 50+ real TOTVS functions with metadata
  - FunctionValidator class with 9 public methods
  - Language compatibility tracking (advpl, tlpp, both)

- `mcp-server/src/template-validator.ts` (450+ lines)
  - Validates ADVPL/TLPP templates before generation
  - Detects function issues: fictitious, incompatible, missing
  - Validates structure: functions, Control Sequence, includes
  - Detailed error reporting with suggestions

- `mcp-server/commands/validate.md` (180 lines)
  - Tool: **`advpl_validate`** for standalone template validation

#### Phase 5.2: Integration & Linter Enhancement
- **Boilerplate Integration**: All boilerplates now validated on generation
  - Modified: `src/boilerplates.ts` - Added validation field and calls
  - Result: HttpServer() removed from REST TLPP template
  
- **Linter Enhancement**: Function validation rules added
  - New rule **L005**: Detects fictitious functions
  - New rule **L006**: Detects language incompatibilities
  - Method: `validateFunctionCalls()` with registry integration

- **MCP Handler Enhancement**
  - Updated `advpl_generate` handler with validation error reporting
  - User-friendly messages with line numbers and suggestions
  - Validation status shown alongside output

- **Integration Tests**: `src/__tests__/phase5-boilerplate-integration-test.ts` (200+ lines)
  - 6 new tests covering all boilerplate types
  - REST template validation (HttpServer removed)
  - Statistics validation

### Changed
- **Version Bump**: 1.1.4 → **1.1.5**
- **REST TLPP Template**: Completely refactored to remove HttpServer()
  - Now uses proper TLPP class-based approach
  - Methods: HandleGet(), HandlePost(), GetResponse()
  
### Fixed
- ✅ [CRÍTICO] Fictitious functions in templates eliminated
- ✅ REST TLPP template now valid and compileable
- ✅ Boilerplate validation integrated automatically
- ✅ Linter now detects invalid function calls

### Known Issues
- None critical. All Phase 5 tests passing (21/21 ✅)

## [1.1.4] - 2026-04-02

**🎯 Status:** Fully Functional | **📊 Tests:** 13/13 ✅ | **📚 Docs:** Complete

### Added

#### Phase 4: SX Tool (Dictionary Access)
- `mcp-server/src/sx-tool.ts` (445 lines)
- Structured access to Protheus data dictionary (SX tables)
- Database with 4 main tables, 13 fields, 5 MV_* parameters, 3 generic tables (SX5)
- 8 public methods: getTable, getField, searchFields, getParameter, getGenericTable, getAllTables, formatTableSummary, exportAsJson
- Tool: **`advpl_sx`** with 6 actions

#### Phase 4: Snippets Generator (Code Templates)
- `mcp-server/src/snippets-generator.ts` (520 lines)
- 10 pre-built code templates for ADVPL/TLPP
- Enforces Sensei's golden rules (Begin Sequence, Locals at top, Hungarian notation)
- Supports JSON and Markdown export
- VS Code `.code-snippets` file generation
- Tool: **`advpl_snippets`** with 4 actions

#### Command Definitions
- `mcp-server/commands/sx.md` (180 lines) - SX Tool reference
- `mcp-server/commands/snippets.md` (250 lines) - Snippets reference

#### Documentation
- `plans/phase-4-documentation.md` - Technical deep dive
- `plans/FASE-4-RELATORIO-FINAL.md` - Executive summary
- `GUIA-PRATICO-FASE-4.md` - User's practical guide
- `mcp-server/test-phase4.ts` - Full test suite

### Changed
- **Version Bump**: 1.1.2 → **1.1.4**
- **Server Version**: Updated in `index.ts` and `package.json`
- **MCP Handlers**: Added 2 new handlers (SX and Snippets) with 210+ lines of logic

### Fixed
- N/A (New feature release)

### Known Issues (To Fix in FASE 5)
- ⚠️ Some templates use functions that may not exist (e.g., `HttpServer()`)
- ⚠️ Linter doesn't validate function existence
- ⚠️ SX Tool database is incomplete (only main tables)

### Deprecated
- N/A

### Tests
```
✅ 13/13 Test Cases Passed
✅ SX Tool: All 8 operations validated
✅ Snippets: All 4 actions working
✅ Data integrity: Confirmed
✅ Build: TypeScript → JS successful
```

### Files Changed
```
Created:
  - src/sx-tool.ts (445 lines)
  - src/snippets-generator.ts (520 lines)
  - commands/sx.md (180 lines)
  - commands/snippets.md (250 lines)
  - test-phase4.ts (250 lines)
  - plans/phase-4-documentation.md
  - plans/FASE-4-RELATORIO-FINAL.md
  - GUIA-PRATICO-FASE-4.md

Modified:
  - src/index.ts (+210 lines)
  - package.json (version bump)
  - CHANGELOG.md (this file)
  - plans/improvement-suggestions.md (updated)
```

### Total Impact
- **Lines Added**: ~1,605
- **Files Created**: 8
- **Files Modified**: 3
- **Classes Implemented**: 2
- **Public Methods**: 18+
- **Tools Available**: 8
- **Snippets**: 10
- **Database Entries**: 50+

---

## [1.1.3] - 2026-04-02

### Added
- **Phase 3: TDN Scraper**: Implemented `mcp-server/src/tdn-scraper.ts` and integrated the `advpl_entrypoint` tool to fetch Entry Point information from the TDN.
- **New Tool: `advpl_entrypoint`**: Dedicated tool to query TDN for Entry Point details (parameters, return type, routine, URL).

---

## [1.1.2] - 2026-04-02

### Added
- **Phase 1: Sensei Linter**: Implemented `mcp-server/src/linter.ts` for ADVPL/TLPP validation.
  - Validates "Golden Rules": Locals at top, Hungarian notation, no Privates
  - 13 lint rules implemented
  
- **Phase 2: Boilerplate Generator**: Implemented `mcp-server/src/boilerplates.ts` for code generation.
  - Supports Function, Class, MVC, and REST API templates
  - Physical file generation (not simulation)
  
- **New Tool: `advpl_lint`**: Static analysis via MCP
- **Improvement Roadmap**: `plans/improvement-suggestions.md` with 8-phase plan
- **Project Review**: Comprehensive codebase analysis completed

### Changed
- **Tool Evolution**: `advpl_generate` performs real file generation
- **Version**: 1.0.7 → 1.1.2

---

## [1.1.0] - 2026-04-01

### Added
- **Core MCP Server**: Refined `index.ts` with better `CallToolRequestSchema` handling
- **Structured Commands**: Parameter schemas in frontmatter for all commands
- **Project Rename**: Claude Code plugin → Advpl Sensei MCP Server
- **MCP Integration**: Broader support for Copilot, Cline, Roo Code, Continue

---

## [1.0.7] - 2026-03-30

### Added
- Initial release as claudecode extension in Claude Code
- 10 specialized agents
- 12 custom commands
- 190+ native functions reference
- Protheus SX dictionary documentation

---

## 🎯 Roadmap

### ✅ Completed (Phases 1-4)
- [x] Sensei Linter (FASE 1)
- [x] Boilerplate Generator (FASE 2)
- [x] TDN Scraper (FASE 3)
- [x] SX Tool & Snippets (FASE 4)

### 🔄 In Progress / Planned (Phases 5-8)
- [ ] Function Registry & Validation (FASE 5) - Resolve fictitious functions issue
- [ ] Advanced Template Management (FASE 6) - Module-specific templates
- [ ] Real-time TDN Integration (FASE 7) - Always up-to-date docs
- [ ] Code Quality Dashboard (FASE 8) - Metrics and analytics

---

## 📊 Version History

| Version | Date | Features | Status |
|---------|------|----------|--------|
| 1.0.7 | Mar 30, 2026 | Initial release | ✅ |
| 1.1.0 | Apr 1, 2026 | MCP Server | ✅ |
| 1.1.2 | Apr 2, 2026 | Fases 1-2 | ✅ |
| 1.1.3 | Apr 2, 2026 | Fase 3 | ✅ |
| 1.1.4 | Apr 2, 2026 | **Fase 4** | ✅ **CURRENT** |
| 1.2.0 | TBD | Fases 5-6 | 🔄 Planned |
| 1.3.0 | TBD | Fases 7-8 | 📋 Planned |

---

## 📝 Contribution Guidelines

For future versions:
1. Follow existing code patterns and documentation style
2. Include tests for new features (target: 100% coverage)
3. Update CHANGELOG.md with changes
4. Document all public methods and classes
5. Validate against TOTVS official API before release

---

**Last Updated:** April 2, 2026  
**Maintainer:** Neto Almanca  
**License:** MIT

## [1.1.3] - 2026-04-02

### Added
- **Phase 3: TDN Scraper**: Implemented `mcp-server/src/tdn-scraper.ts` and integrated the `advpl_entrypoint` tool to fetch Entry Point information from the TDN.
- **New Tool: `advpl_entrypoint`**: Added a dedicated tool to query TDN for Entry Point details (parameters, return type, routine, URL).

## [1.1.2] - 2026-04-02

### Added
- **Phase 1: Sensei Linter**: Implemented `mcp-server/src/linter.ts` to automatically validate ADVPL/TLPP "Golden Rules" (Locals at the top, Hungarian notation, no Privates).
- **Phase 2: Boilerplate Generator**: Implemented `mcp-server/src/boilerplates.ts` allowing the server to physically generate basic source files for Functions, Classes, MVC, and REST APIs.
- **New Tool: `advpl_lint`**: Added a dedicated tool to perform static analysis on source code via MCP.
- **Improvement Roadmap**: Created `plans/improvement-suggestions.md` outlining the development phases.
- **Project Exploration**: Completed a comprehensive review of the codebase.

### Changed
- **Tool Evolution**: The `advpl_generate` tool now performs real file generation instead of just simulating responses.
- **Version Bump**: Updated internal server version to `1.1.2`.

## [1.1.0] - 2026-04-01
...

### Added
- **Core MCP Server Implementation**: Refined `mcp-server/src/index.ts` to improve the `CallToolRequestSchema` handler, making it more informative about tool arguments and error handling during simulation.
- **Structured Command Definitions**: All command `.md` files in `mcp-server/commands/` now include structured `parameters` in their frontmatter, defining clear input schemas for each tool.

### Changed
- **Project Renamed**: The project is now officially named **Advpl Sensei**.
- **MCP Server Transition**: Shifted focus to implementing a **Model Context Protocol (MCP) Server** in `mcp-server/`, enabling broader integration with VS Code extensions (Cline, Roo Code, Continue).
- **Updated Tool Documentation**: Command definition files (`.md`) now feature detailed `parameters` in their frontmatter, improving schema definition for the MCP server.

## [1.0.7] - 2026-03-30
### Added
- Initial release as a Claude Code plugin specializing in ADVPL and TLPP.
- Support for 10 specialized agents and 12 custom commands.
- Built-in reference for 190+ native functions and Protheus SX dictionary.
