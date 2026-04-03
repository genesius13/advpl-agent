/**
 * Registry Quality Check - Ferranha para verificar qualidade do Function Registry
 */

import { RegistryAnalyzer } from "../registry-analyzer.js";

export async function checkRegistryQuality() {
  console.log("\n🔍 Analisando Function Registry...\n");

  const analysis = RegistryAnalyzer.analyze();
  const report = RegistryAnalyzer.generateReport(analysis);

  console.log(report);

  return analysis;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkRegistryQuality().catch(console.error);
}
