import { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const statePath = join(root, 'local', 'project-state.json');
const templatePath = join(root, 'templates', 'project-state.json');
const allowedFields = new Set(['project', 'objective', 'status', 'currentStage', 'decisions', 'completed', 'nextActions', 'constraints', 'artifacts', 'openQuestions']);

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function init() {
  mkdirSync(dirname(statePath), { recursive: true });
  if (!existsSync(statePath)) writeFileSync(statePath, readFileSync(templatePath), { flag: 'wx' });
  return loadJson(statePath);
}

function save(state) {
  state.updatedAt = new Date().toISOString();
  writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
}

function safeInput(name) {
  if (!name || isAbsolute(name) || name.includes(':') || name.includes('\\')) throw Error('Use a relative project path');
  const path = resolve(root, name);
  if (relative(root, path).startsWith('..') || !existsSync(path) || !lstatSync(path).isFile()) throw Error('Unavailable file: ' + name);
  return path;
}

function compact(state) {
  const take = value => Array.isArray(value) ? value.slice(-8) : value;
  return Object.fromEntries(Object.entries(state).filter(([, value]) => value !== '' && value !== null && (!Array.isArray(value) || value.length)).map(([key, value]) => [key, take(value)]));
}

function context(files) {
  const config = loadJson(join(root, 'config', 'jarvis.json'));
  const budget = config.contextOptimization?.defaultCharacterBudget ?? 12000;
  let output = '# PROJECT STATE\n' + JSON.stringify(compact(init()), null, 2) + '\n';
  for (const name of files) {
    const text = readFileSync(safeInput(name), 'utf8');
    const remaining = budget - output.length;
    if (remaining <= 200) break;
    output += `\n# ${name}\n${text.slice(0, remaining)}\n`;
  }
  process.stdout.write(output.slice(0, budget));
}

const [command, field, ...rest] = process.argv.slice(2);
try {
  if (command === 'init') console.log(JSON.stringify(init(), null, 2));
  else if (command === 'show') console.log(JSON.stringify(compact(init()), null, 2));
  else if (command === 'set') {
    if (!allowedFields.has(field)) throw Error('Unsupported field');
    const state = init();
    const raw = rest.join(' ').trim();
    state[field] = Array.isArray(state[field]) ? JSON.parse(raw) : raw;
    save(state);
    console.log('Project memory updated: ' + field);
  } else if (command === 'context') context(process.argv.slice(3));
  else throw Error('Usage: memory.mjs init|show|set <field> <value>|context [relative files]');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
