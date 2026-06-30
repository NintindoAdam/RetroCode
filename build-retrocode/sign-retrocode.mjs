import path from 'node:path';
import { sign } from '@electron/osx-sign';

const app = process.argv[2];
const entDir = process.argv[3];
const IDENTITY = 'Developer ID Application: Adam Markocki (CBGR43HVMN)';

const ent = (f) => path.join(entDir, f);
function entitlementsFor(filePath) {
  if (filePath.includes('Helper (GPU)')) return ent('helper-gpu-entitlements.plist');
  if (filePath.includes('Helper (Plugin)')) return ent('helper-plugin-entitlements.plist');
  if (filePath.includes('Helper (Renderer)')) return ent('helper-renderer-entitlements.plist');
  if (filePath.includes('Helper')) return ent('helper-entitlements.plist');
  return ent('app-entitlements.plist');
}

console.log('Signing', app, 'with', IDENTITY);
await sign({
  app,
  identity: IDENTITY,
  platform: 'darwin',
  optionsForFile: (filePath) => ({
    hardenedRuntime: true,
    entitlements: entitlementsFor(filePath),
    timestamp: undefined,
  }),
});
console.log('SIGNED OK');
