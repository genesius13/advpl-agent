# 📦 COMO ATUALIZAR PARA v1.1.5

**Versão Anterior:** (qualquer versão < 1.1.5)  
**Versão Nova:** 1.1.5  
**Status:** ✅ Disponível no npm

---

## ⚡ Atualizar em 1 Comando

### Opção 1: Atualização Simples (Recomendada)

```bash
npm update @netoalmanca/advpl-sensei
```

Este comando vai automaticamente atualizar para a versão mais recente (1.1.5).

---

### Opção 2: Atualizar para uma Versão Específica

```bash
npm install @netoalmanca/advpl-sensei@1.1.5
```

---

### Opção 3: Atualizar Globalmente (se instalado como global)

```bash
npm install -g @netoalmanca/advpl-sensei@latest
```

Depois verify:
```bash
advpl-sensei --version
```

---

## 📋 Passo a Passo

### Se você instalou em um projeto:

```bash
# 1. Navegar até o projeto
cd /seu/projeto

# 2. Atualizar o pacote
npm update @netoalmanca/advpl-sensei

# 3. Verificar versão instalada
npm list @netoalmanca/advpl-sensei
```

### Se você instalou é global:

```bash
# 1. Atualizar globalmente
npm install -g @netoalmanca/advpl-sensei@latest

# 2. Verificar versão
npm list -g @netoalmanca/advpl-sensei
```

---

## ✅ Verificar Versão Instalada

```bash
# Ver versão instalada
npm list @netoalmanca/advpl-sensei

# Ou
npm view @netoalmanca/advpl-sensei version
```

**Você deve ver:** `@netoalmanca/advpl-sensei@1.1.5`

---

## 📊 O Que's Novo em v1.1.5

### ✨ Novas Funcionalidades
- ✅ Phase 10: MCP Command Integration
- ✅ 5-layer validation architecture
- ✅ TDN function validation (76 functions)
- ✅ Enhanced snippets validation
- ✅ Automatic scraper with 24h cache

### 📈 Melhorias
- ✅ 94/94 testes passando (100%)
- ✅ 0 erros no build
- ✅ Type definitions completas
- ✅ Documentação expandida

### 🔄 Mudanças Breaking (Nenhuma!)
- ✅ Compatível com versões anteriores
- ✅ Sem modificações na API
- ✅ Atualização segura

---

## 🔗 Links Úteis

- **NPM Package:** https://www.npmjs.com/package/@netoalmanca/advpl-sensei
- **GitHub:** https://github.com/genesius13/advpl-sensei
- **Release Notes:** [CHANGELOG.md](../CHANGELOG.md)
- **Documentation:** [IMPLEMENTATION-PHASES-COMPLETE.md](../IMPLEMENTATION-PHASES-COMPLETE.md)

---

## 🆘 Troubleshooting

### "npm ERR! code ERESOLVE"
```bash
# Force resolve
npm install @netoalmanca/advpl-sensei@1.1.5 --legacy-peer-deps
```

### "Package not found"
```bash
# Clear cache e tentar novamente
npm cache clean --force
npm update @netoalmanca/advpl-sensei
```

### "Permissão negada"
```bash
# Se instalado globalmente com error de permissão
sudo npm install -g @netoalmanca/advpl-sensei@latest
```

---

## 📋 Versões Disponíveis

```bash
# Ver todas as versões disponíveis
npm view @netoalmanca/advpl-sensei versions
```

**Versões compatíveis:**
- 1.1.5 ✅ (Atual - Recomendada)
- 1.1.4
- 1.1.3
- 1.1.2

---

**Última atualização:** 3 Abril 2026

