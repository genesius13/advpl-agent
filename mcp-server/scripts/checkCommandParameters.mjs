import { promises as fs } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    try {
      const metadata = yaml.load(match[1]);
      return { metadata, body: match[2] };
    } catch (e) {
      return { metadata: {}, body: content, error: e };
    }
  }
  return { metadata: {}, body: content };
}

const validTypes = new Set(['string','number','integer','boolean','object','array','null']);

async function check() {
  const commandsDir = path.resolve(process.cwd(), 'mcp-server', 'commands');
  const files = await fs.readdir(commandsDir);
  const results = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const full = path.join(commandsDir, file);
    const content = await fs.readFile(full, 'utf-8');
    const { metadata, error } = parseFrontmatter(content);
    const issues = [];
    if (error) {
      issues.push(`Invalid frontmatter YAML: ${error.message}`);
    }
    if (!metadata || typeof metadata !== 'object') {
      issues.push('Missing metadata/frontmatter');
    } else {
      const params = metadata.parameters;
      if (params === undefined) {
        // OK — no parameters
      } else if (typeof params !== 'object') {
        issues.push('`parameters` is not an object');
      } else {
        for (const [pname, pspec] of Object.entries(params)) {
          if (pspec == null || typeof pspec !== 'object') {
            issues.push(`parameter '${pname}' is not an object`);
            continue;
          }
          if (!('type' in pspec)) {
            issues.push(`parameter '${pname}' missing 'type' property`);
            continue;
          }
          const t = pspec.type;
          if (typeof t === 'string') {
            if (!validTypes.has(t)) issues.push(`parameter '${pname}' has invalid type '${t}'`);
          } else if (Array.isArray(t)) {
            for (const tt of t) if (!validTypes.has(tt)) issues.push(`parameter '${pname}' has invalid type in array '${tt}'`);
          } else {
            issues.push(`parameter '${pname}' has non-string 'type'`);
          }
        }
      }
    }
    results.push({ file, issues });
  }

  let any = false;
  for (const r of results) {
    if (r.issues.length) {
      any = true;
      console.log(`${r.file}:`);
      for (const it of r.issues) console.log(`  - ${it}`);
    }
  }
  if (!any) console.log('Nenhum problema detectado nos parâmetros dos comandos.');
}

check().catch(err => { console.error('Erro ao checar comandos:', err); process.exit(1); });
