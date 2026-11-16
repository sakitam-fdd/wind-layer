import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const pkgRoot = resolve(__dirname, '..');
const expectedExports = ['WindCore', 'Field', 'Vector', 'defaultOptions', 'formatData'];

describe('wind-core package exports', () => {
  let tmpDir: string;
  let installedPkgDir: string;

  beforeAll(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'wind-core-exports-'));
    installedPkgDir = join(tmpDir, 'node_modules', 'wind-core');
    mkdirSync(installedPkgDir, { recursive: true });

    const npmBin = join(dirname(process.execPath), process.platform === 'win32' ? 'npm.cmd' : 'npm');
    const npmCmd = existsSync(npmBin) ? npmBin : 'npm';
    execFileSync(npmCmd, ['pack', '--pack-destination', tmpDir], {
      cwd: pkgRoot,
      stdio: 'pipe',
    });

    const tgzName = readdirSync(tmpDir).find((file) => file.endsWith('.tgz'));
    if (!tgzName) {
      throw new Error('Failed to locate packed tarball for wind-core');
    }

    execFileSync('tar', ['-xzf', join(tmpDir, tgzName), '-C', installedPkgDir, '--strip-components=1'], {
      stdio: 'pipe',
    });
  });

  afterAll(() => {
    if (tmpDir && existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test('tarball contains expected built artifacts and declaration files', () => {
    expect(existsSync(join(installedPkgDir, 'dist/wind-core.cjs'))).toBe(true);
    expect(existsSync(join(installedPkgDir, 'dist/wind-core.esm.js'))).toBe(true);
    expect(existsSync(join(installedPkgDir, 'dist/wind-core.js'))).toBe(true);
    expect(existsSync(join(installedPkgDir, 'dist/index.d.ts'))).toBe(true);
    expect(existsSync(join(installedPkgDir, 'dist/index.d.cts'))).toBe(true);
  });

  test.each([
    { label: 'default CJS require', args: [] as string[] },
    { label: 'production CJS require', args: ['--conditions=production'] },
    { label: 'development CJS require', args: ['--conditions=development'] },
  ])('loads cleanly via $label in native Node.js', ({ args }) => {
    const script = ["const mod = require('wind-core');", 'console.log(JSON.stringify(Object.keys(mod)));'].join(' ');
    const output = execFileSync(process.execPath, [...args, '-e', script], {
      cwd: tmpDir,
      encoding: 'utf8',
    });
    const keys = JSON.parse(output.trim()) as string[];
    for (const name of expectedExports) {
      expect(keys).toContain(name);
    }
  });

  test.each([
    { label: 'default ESM import', args: ['--input-type=module'] },
    { label: 'production ESM import', args: ['--conditions=production', '--input-type=module'] },
    { label: 'development ESM import', args: ['--conditions=development', '--input-type=module'] },
  ])('loads cleanly via $label in native Node.js', ({ args }) => {
    const script = ["import * as mod from 'wind-core';", 'console.log(JSON.stringify(Object.keys(mod)));'].join(' ');
    const output = execFileSync(process.execPath, [...args, '-e', script], {
      cwd: tmpDir,
      encoding: 'utf8',
    });
    const keys = JSON.parse(output.trim()) as string[];
    for (const name of expectedExports) {
      expect(keys).toContain(name);
    }
  });
});
