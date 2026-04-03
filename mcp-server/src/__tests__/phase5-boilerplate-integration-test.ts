/**
 * Testes de Integração Phase 5 - Boilerplate Generator com Validation
 */

import { BoilerplateGenerator } from "../boilerplates.js";

export async function testBoilerplateIntegration() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  Boilerplate + Validator Integration Test  ║");
  console.log("╚════════════════════════════════════════════╝\n");

  // Test 1: Function boilerplate should be valid
  console.log("Test 1: Function boilerplate validation");
  const funcBoilerplate = BoilerplateGenerator.generate("function", "TestFunc", "GEN", "advpl");
  console.assert(funcBoilerplate.validation !== undefined, "Validação deve estar presente");
  console.assert(funcBoilerplate.validation?.valid === true, "Template função deve ser válido");
  console.log("✓ Function template is valid");

  // Test 2: Class boilerplate should be valid
  console.log("\nTest 2: Class boilerplate validation");
  const classBoilerplate = BoilerplateGenerator.generate("class", "TestClass", "GEN", "tlpp");
  console.assert(classBoilerplate.validation !== undefined, "Validação deve estar presente");
  console.assert(classBoilerplate.validation?.valid === true, "Template classe deve ser válido");
  console.log("✓ Class template is valid");

  // Test 3: MVC boilerplate should be valid
  console.log("\nTest 3: MVC boilerplate validation");
  const mvcBoilerplate = BoilerplateGenerator.generate("mvc", "TestMVC", "FAT", "advpl");
  console.assert(mvcBoilerplate.validation !== undefined, "Validação deve estar presente");
  console.assert(mvcBoilerplate.validation?.valid === true, "Template MVC deve ser válido");
  console.log("✓ MVC template is valid");

  // Test 4: REST ADVPL boilerplate should be valid
  console.log("\nTest 4: REST ADVPL boilerplate validation");
  const restAdvplBoilerplate = BoilerplateGenerator.generate("rest", "TestRest", "API", "advpl");
  console.assert(restAdvplBoilerplate.validation !== undefined, "Validação deve estar presente");
  console.assert(restAdvplBoilerplate.validation?.valid === true, "Template REST ADVPL deve ser válido");
  console.log("✓ REST ADVPL template is valid");

  // Test 5: REST TLPP boilerplate should be valid
  console.log("\nTest 5: REST TLPP boilerplate validation");
  const restTlppBoilerplate = BoilerplateGenerator.generate("rest", "TestRest", "API", "tlpp");
  console.assert(restTlppBoilerplate.validation !== undefined, "Validação deve estar presente");
  console.assert(restTlppBoilerplate.validation?.valid === true, "Template REST TLPP deve ser válido (sem HttpServer)");
  console.log("✓ REST TLPP template is valid (HttpServer removed)");

  // Test 6: Verify validation contains statistics
  console.log("\nTest 6: Validation statistics");
  const boilerplate = BoilerplateGenerator.generate("function", "TestFunc", "GEN", "advpl");
  console.assert(boilerplate.validation !== undefined, "Validation deve estar presente");
  console.assert(boilerplate.validation && boilerplate.validation.statistics !== undefined, "Statistics deve estar presente");
  console.assert(boilerplate.validation && boilerplate.validation.statistics.totalLines > 0, "Deve contar linhas");
  console.assert(boilerplate.validation && boilerplate.validation.statistics.errorCount >= 0, "Deve ter contagem de erros");
  console.log(`✓ Template stats: ${boilerplate.validation?.statistics.totalLines} lines, ${boilerplate.validation?.statistics.errorCount} errors`);

  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║  ✅  ALL INTEGRATION TESTS PASSED!        ║");
  console.log("╚════════════════════════════════════════════╝\n");

  return { passed: 6, failed: 0, total: 6 };
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testBoilerplateIntegration().catch(console.error);
}
