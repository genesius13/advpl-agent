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

async function dump() {
  const commandsDir = path.resolve(process.cwd(), 'mcp-server', 'commands');
  const files = await fs.readdir(commandsDir);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const name = file.replace('.md','');
    const content = await fs.readFile(path.join(commandsDir, file), 'utf-8');
    const { metadata } = parseFrontmatter(content);
    const inputSchema = {
      type: 'object',
      properties: metadata.parameters || {
        prompt: { type: 'string', description: 'O prompt ou instrução para o comando' },
        args: { type: 'string', description: 'Argumentos adicionais (opcional)' },
      },
      required: metadata.parameters ? Object.keys(metadata.parameters).filter(k => metadata.parameters[k].required !== false) : ['prompt'],
    };

    console.log(`--- ${name} ---`);
    console.log(JSON.stringify(inputSchema, null, 2));
  }
}

dump().catch(err => { console.error('Erro:', err); process.exit(1); });
