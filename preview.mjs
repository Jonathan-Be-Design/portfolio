import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Wrangler resolves env files from its config directory; Node resolves them from
// cwd. An absolute path lets both load the local secret without copying it.
const resolve = path => fileURLToPath(new URL(path, import.meta.url));
const environment = resolve('.env.local');
const child = spawn(process.execPath, [
  resolve('node_modules/wrangler/bin/wrangler.js'), 'dev',
  '--config', resolve('dist/server/wrangler.json'),
  ...(existsSync(environment) ? ['--env-file', environment] : []),
  '--ip', '127.0.0.1',
  ...process.argv.slice(2),
], {
  cwd: resolve('.'),
  stdio: 'inherit',
  env: { ...process.env, WRANGLER_WRITE_LOGS: 'false' },
});
child.on('error', () => { console.error('Não foi possível iniciar a prévia local.'); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
