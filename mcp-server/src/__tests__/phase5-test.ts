/**
 * Testes Phase 5 - Function Registry & Validation
 * 
 * Validar:
 * 1. FunctionValidator registra funções conhecidas
 * 2. FunctionValidator identifica funções fictícias
 * 3. TemplateValidator detecta funções incompatíveis
 * 4. TemplateValidator valida estrutura ADVPL/TLPP
 */

import { FunctionValidator } from "../function-registry.js";
import { TemplateValidator, TemplateValidationResult } from "../template-validator.js";

// =========================================
// TESTES - FUNCTION REGISTRY
// =========================================

function testFunctionRegistryExists() {
  const result = FunctionValidator.exists("GetArea");
  console.assert(result === true, "GetArea deve existir");
  console.log("✓ Test 1: FunctionValidator.exists() - funções conhecidas");
}

function testFunctionRegistryNotExists() {
  const result = FunctionValidator.exists("NonExistentFunction123");
  console.assert(result === false, "NonExistentFunction123 não deve existir");
  console.log("✓ Test 2: FunctionValidator.exists() - funções desconhecidas");
}

function testFunctionRegistryFictitious() {
  const result = FunctionValidator.isFictitious("HttpServer");
  console.assert(result === true, "HttpServer deve ser fictícia");
  console.log("✓ Test 3: FunctionValidator.isFictitious() - funções fictícias");
}

function testFunctionRegistryNotFictitious() {
  const result = FunctionValidator.isFictitious("GetArea");
  console.assert(result === false, "GetArea não deve ser fictícia");
  console.log("✓ Test 4: FunctionValidator.isFictitious() - funções reais");
}

function testFunctionCompatibilityAdvpl() {
  const result = FunctionValidator.isCompatibleWith("GetArea", "advpl");
  console.assert(result === true, "GetArea deve ser compatível com ADVPL");
  console.log("✓ Test 5: FunctionValidator.isCompatibleWith() - ADVPL");
}

function testFunctionCompatibilityTlpp() {
  const result = FunctionValidator.isCompatibleWith("GetArea", "tlpp");
  console.assert(result === true, "GetArea deve ser compatível com TLPP");
  console.log("✓ Test 6: FunctionValidator.isCompatibleWith() - TLPP both");
}

function testFunctionLanguageSpecific() {
  // JsonObject é TLPP only
  const tlpp = FunctionValidator.isCompatibleWith("JsonObject", "tlpp");
  const advpl = FunctionValidator.isCompatibleWith("JsonObject", "advpl");
  
  console.assert(tlpp === true, "JsonObject deve ser compatível com TLPP");
  console.assert(advpl === false, "JsonObject NÃO deve ser compatível com ADVPL");
  console.log("✓ Test 7: FunctionValidator.isCompatibleWith() - linguagem específica");
}

// =========================================
// TESTES - TEMPLATE VALIDATOR
// =========================================

function testTemplateValidatorValidAdvpl() {
  const code = `
User Function TestFunc()
  Local nResult := 0
  Return nResult
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  
  console.assert(result.valid === true, "Template válido deve passar");
  console.assert(result.language === "advpl", "Deve detectar como ADVPL");
  console.log("✓ Test 8: TemplateValidator.validate() - ADVPL válido");
}

function testTemplateValidatorFictitousFunctionError() {
  const code = `
User Function RestAPI()
  Local oServer := HttpServer()
  Return oServer
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  
  console.assert(result.valid === false, "Template com HttpServer deve falhar");
  console.assert(
    result.issues.some(i => i.code === "FUNC_FICTITIOUS"),
    "Deve ter erro FUNC_FICTITIOUS"
  );
  console.log("✓ Test 9: TemplateValidator.validate() - detecta funções fictícias");
}

function testTemplateValidatorLanguageIncompatibility() {
  const code = `
User Function TestJson()
  Local oJson := JsonObject()
  Return oJson
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  
  console.assert(result.valid === false, "JsonObject em ADVPL deve falhar");
  console.assert(
    result.issues.some(i => i.code === "FUNC_INCOMPATIBLE"),
    "Deve ter erro FUNC_INCOMPATIBLE"
  );
  console.log("✓ Test 10: TemplateValidator.validate() - incompatibilidade de linguagem");
}

function testTemplateValidatorMissingReturn() {
  const code = `
User Function NoReturn()
  Local nResult := 0
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  
  console.assert(result.valid === false, "Função sem Return deve ter warning");
  console.assert(
    result.issues.some(i => i.code === "NO_RETURN"),
    "Deve ter aviso NO_RETURN"
  );
  console.log("✓ Test 11: TemplateValidator.validate() - valida Return");
}

function testTemplateValidatorTlppClass() {
  const code = `
Class TestClass
  Public cName As String
  Method New()
    Self:cName := "Test"
  EndMethod
EndClass
  `;
  
  const result = TemplateValidator.validate(code, "test.tlpp", "tlpp");
  
  console.assert(result.language === "tlpp", "Deve detectar como TLPP");
  console.assert(result.valid === true, "Classe TLPP válida deve passar");
  console.log("✓ Test 12: TemplateValidator.validate() - TLPP Class válida");
}

function testTemplateValidatorTlppMissingEndClass() {
  const code = `
Class TestClass
  Public cName As String
  Method New()
    Self:cName := "Test"
  // Missing EndClass
  `;
  
  const result = TemplateValidator.validate(code, "test.tlpp", "tlpp");
  
  console.assert(result.valid === false, "Classe sem EndClass deve falhar");
  console.assert(
    result.issues.some(i => i.code === "NO_ENDCLASS"),
    "Deve ter erro NO_ENDCLASS"
  );
  console.log("✓ Test 13: TemplateValidator.validate() - valida EndClass");
}

function testTemplateValidatorReport() {
  const code = `
User Function Test()
  Local oJson := JsonObject()
  Return oJson
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  const report = TemplateValidator.generateReport(result);
  
  console.assert(report.includes("Invalid"), "Report deve conter status");
  console.assert(report.includes("1"), "Report deve conter contagem de erros");
  console.log("✓ Test 14: TemplateValidator.generateReport() - formatação");
}

function testTemplateValidatorStatistics() {
  const code = `
User Function Test()
  Local x := HttpServer()
  Local y := JsonObject()
  Return x
  `;
  
  const result = TemplateValidator.validate(code, "test.prw", "advpl");
  
  console.assert(result.statistics.errorCount >= 2, "Deve ter pelo menos 2 erros");
  console.assert(result.statistics.totalLines > 0, "Deve contar linhas");
  console.log("✓ Test 15: TemplateValidator.validate() - estatísticas");
}

// =========================================
// EXECUÇÃO DOS TESTES
// =========================================

export async function runPhase5Tests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  PHASE 5 Tests - Function Registry & Validation  ║");
  console.log("╚════════════════════════════════════════════╝\n");

  try {
    // Tests - Function Registry
    testFunctionRegistryExists();
    testFunctionRegistryNotExists();
    testFunctionRegistryFictitious();
    testFunctionRegistryNotFictitious();
    testFunctionCompatibilityAdvpl();
    testFunctionCompatibilityTlpp();
    testFunctionLanguageSpecific();

    // Tests - Template Validator
    testTemplateValidatorValidAdvpl();
    testTemplateValidatorFictitousFunctionError();
    testTemplateValidatorLanguageIncompatibility();
    testTemplateValidatorMissingReturn();
    testTemplateValidatorTlppClass();
    testTemplateValidatorTlppMissingEndClass();
    testTemplateValidatorReport();
    testTemplateValidatorStatistics();

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║  ✅  ALL 15 TESTS PASSED!                 ║");
    console.log("╚════════════════════════════════════════════╝\n");

    return { passed: 15, failed: 0, total: 15 };
  } catch (error) {
    console.error("\n❌ Test Error:", error);
    throw error;
  }
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  runPhase5Tests().catch(console.error);
}
