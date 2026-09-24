import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './jarvis.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, ['scripts/jarvis.mjs', 'check'], { cwd: root, stdio: 'inherit' });
execFileSync(process.execPath, ['--test', 'tests/distribution.test.mjs'], { cwd: root, stdio: 'inherit' });
console.log(build(root, join(root, '..', 'Distribution-Build')));
