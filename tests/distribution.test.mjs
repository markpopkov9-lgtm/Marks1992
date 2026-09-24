import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { safeFile, scan, publicFiles, build } from '../scripts/jarvis.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('reject traversal, absolute and Windows stream paths', () => {
  for (const path of ['../outside', 'a/../../b', '/etc/passwd', 'C:/data', 'a:b', 'a\\b']) assert.throws(() => safeFile(root, path));
});
test('reject credential formats without disclosing values', () => {
  const secret = 'gh' + 'p_' + 'a'.repeat(32);
  assert.throws(() => scan(secret, 'fixture'), error => !error.message.includes(secret));
  scan('No credentials required.', 'safe');
});
test('build excludes local state and validates every output hash', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'jarvis-test-'));
  for (const { name, data } of publicFiles(root)) {
    mkdirSync(dirname(join(temporary, name)), { recursive: true });
    writeFileSync(join(temporary, name), data);
  }
  mkdirSync(join(temporary, 'local'));
  writeFileSync(join(temporary, 'local/private.txt'), 'private sentinel');
  writeFileSync(join(temporary, 'unlisted.txt'), 'unlisted sentinel');
  const output = build(temporary);
  assert.equal(existsSync(join(output, 'local')), false);
  assert.equal(existsSync(join(output, 'unlisted.txt')), false);
  const manifest = JSON.parse(readFileSync(join(output, 'manifest.json'), 'utf8'));
  for (const file of manifest.files) assert.equal(createHash('sha256').update(readFileSync(join(output, file.path))).digest('hex'), file.sha256);
  assert.equal(publicFiles(output).length, manifest.files.length);
  const list = JSON.parse(readFileSync(join(temporary, 'config/distribution.json'), 'utf8'));
  list.files.push('local/private.txt');
  writeFileSync(join(temporary, 'config/distribution.json'), JSON.stringify(list));
  assert.throws(() => build(temporary), /Private file/);
});
