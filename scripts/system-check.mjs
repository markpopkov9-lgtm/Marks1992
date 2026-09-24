import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const add = (level, name, detail) => results.push({ level, name, detail });

function command(name, args) {
  try { return execFileSync(name, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch { return null; }
}

const config = JSON.parse(readFileSync(join(root, 'config', 'jarvis.json'), 'utf8'));
const statePath = join(root, 'local', 'project-state.json');
const plugin = JSON.parse(readFileSync(join(root, 'plugins', 'studio-os', '.codex-plugin', 'plugin.json'), 'utf8'));

add(Number(process.versions.node.split('.')[0]) >= 22 ? 'PASS' : 'FAIL', 'Node.js', process.version);
const gitVersion = command('git', ['--version']);
add(gitVersion ? 'PASS' : 'FAIL', 'Git', gitVersion ?? 'not available in PATH');
const branch = command('git', ['status', '--short', '--branch']);
add(branch && !branch.split(/\r?\n/).slice(1).length ? 'PASS' : 'WARN', 'Repository', branch ?? 'status unavailable');
add(existsSync(statePath) ? 'PASS' : 'FAIL', 'Project Memory', existsSync(statePath) ? 'local state available' : 'run memory:init');
add(plugin.version ? 'PASS' : 'FAIL', 'Studio OS plugin', plugin.version ?? 'invalid manifest');
add(existsSync(join(root, '.agents', 'skills', 'impeccable', 'SKILL.md')) ? 'PASS' : 'WARN', 'Impeccable QA', existsSync(join(root, '.agents', 'skills', 'impeccable', 'SKILL.md')) ? 'project scope, hooks disabled by policy' : 'not installed');
add(config.integrations?.figma === 'connected-manual' ? 'PASS' : 'WARN', 'Figma', config.integrations?.figma ?? 'unknown');
add('INFO', 'Optional integrations', 'Claude, Tilda, Remotion, 3D and Growth load only when a task needs them');

for (const item of results) console.log(`${item.level.padEnd(4)}  ${item.name}: ${item.detail}`);
if (results.some(item => item.level === 'FAIL')) process.exitCode = 1;
