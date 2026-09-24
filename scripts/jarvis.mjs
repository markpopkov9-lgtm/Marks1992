import { readFileSync, writeFileSync, mkdirSync, existsSync, lstatSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function safeFile(base, name) {
  if (typeof name !== 'string' || !name || name.includes('\\') || name.split('/').some(p => p === '..' || p === '.' || !p) || isAbsolute(name) || name.includes(':')) throw Error('Unsafe path');
  const target = resolve(base, name);
  if (relative(base, target).startsWith('..')) throw Error('Path escapes root');
  let current = base;
  for (const part of name.split('/')) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw Error('Links are forbidden: ' + name);
  }
  if (!lstatSync(target).isFile()) throw Error('Not a file: ' + name);
  return target;
}
export function scan(text, label) {
  const rules = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}/,
    /sk-[A-Za-z0-9_-]{20,}/,
    /AKIA[A-Z0-9]{16}/,
    /(?:api[_-]?key|token|password|secret)\s*[:=]\s*["']?[A-Za-z0-9/+_-]{16,}/i,
    /[A-Z]:\\Users\\[^\s]+/i,
    /\/(?:Users|home)\/[a-z0-9_-]+\//i
  ];
  if (rules.some(rule => rule.test(text))) throw Error('Possible secret or private path in ' + label + ' (value hidden)');
}
export function publicFiles(base) {
  const names = JSON.parse(readFileSync(safeFile(base, 'config/distribution.json'), 'utf8')).files;
  if (!Array.isArray(names) || !names.length || new Set(names).size !== names.length) throw Error('Invalid allowlist');
  const required = ['README.md', 'AGENTS.md', 'package.json', 'config/distribution.json', 'config/jarvis.json', 'scripts/jarvis.mjs'];
  if (required.some(name => !names.includes(name))) throw Error('Missing required file');
  return names.map(name => {
    if (/^(?:local|dist|node_modules|\.git)(?:\/|$)/i.test(name) || /(?:^|\/)\.env(?!\.example$)/i.test(name) || /\.(?:pem|key|p12|pfx)$/i.test(name)) throw Error('Private file in allowlist');
    const data = readFileSync(safeFile(base, name));
    scan(data.toString('utf8'), name);
    if (name.endsWith('.json')) JSON.parse(data.toString('utf8'));
    return { name, data };
  });
}
export function build(base, dist = join(base, 'dist')) {
  const files = publicFiles(base);
  if (existsSync(dist) && lstatSync(dist).isSymbolicLink()) throw Error('dist cannot be a link');
  mkdirSync(dist, { recursive: true });
  const output = join(dist, 'build-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + process.pid);
  mkdirSync(output);
  const manifest = { schemaVersion: 1, files: [] };
  for (const { name, data } of files) {
    const destination = join(output, name);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, data, { flag: 'wx' });
    manifest.files.push({ path: name, sha256: createHash('sha256').update(data).digest('hex') });
  }
  writeFileSync(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  return output;
}
function main(command) {
  if (command === 'init') {
    const local = join(root, 'local');
    if (existsSync(local) && lstatSync(local).isSymbolicLink()) throw Error('local cannot be a link');
    for (const folder of ['local', 'local/tasks', 'local/knowledge', 'local/knowledge/inbox', 'local/knowledge/sources', 'local/knowledge/wiki', 'local/reports', 'local/projects', 'local/design']) {
      const path = join(root, folder);
      if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw Error('Local folder cannot be a link');
      mkdirSync(path, { recursive: true });
    }
    const path = join(local, 'config.json');
    if (!existsSync(path)) writeFileSync(path, JSON.stringify({ studioOsPath: null }, null, 2) + '\n', { flag: 'wx' });
    const memory = join(local, 'project-state.json');
    if (!existsSync(memory)) writeFileSync(memory, readFileSync(join(root, 'templates/project-state.json')), { flag: 'wx' });
    console.log('Local workspace ready. Set studioOsPath in local/config.json.');
  } else if (command === 'doctor') {
    console.log('Node: ' + process.version);
    try { console.log(execFileSync('git', ['--version'], { encoding: 'utf8' }).trim()); } catch { console.log('Git unavailable'); }
    const local = join(root, 'local/config.json');
    const config = existsSync(local) ? JSON.parse(readFileSync(local, 'utf8')) : {};
    const path = config.studioOsPath;
    console.log('Studio OS: ' + (!path ? 'not configured' : !isAbsolute(path) ? 'requires absolute path' : existsSync(path) && lstatSync(path).isDirectory() ? 'directory available (manual integration)' : 'directory missing'));
    console.log('External integrations: manual; no credentials required.');
  } else if (command === 'check') {
    const files = publicFiles(root);
    let tracked = [];
    if (existsSync(join(root, '.git'))) tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
    for (const name of tracked) {
      if (/^(?:local|dist)(?:\/|$)/i.test(name) || /(?:^|\/)\.env(?!\.example$)/i.test(name) || /\.(?:pem|key|p12|pfx)$/i.test(name)) throw Error('Private tracked file: ' + name);
      scan(readFileSync(safeFile(root, name), 'utf8'), name);
    }
    console.log('PASS: ' + files.length + ' distribution files; ' + tracked.length + ' tracked files checked. Manual review still required.');
  } else if (command === 'build') console.log(build(root));
  else throw Error('Usage: node scripts/jarvis.mjs doctor|init|check|build');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv[2]); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
