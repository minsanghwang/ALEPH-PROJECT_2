import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as A from './diagrams-a.mjs';
let B = {}; try { B = await import('./diagrams-b.mjs'); } catch { /* 아직 없음 */ }

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'img');
fs.mkdirSync(out, { recursive: true });
const list = [
  ['00-overview', A.overview], ['01-edge-vpn', A.edgeVpn],
  ['02-security', B.security], ['03-staff', B.staff], ['04-servers', B.servers],
  ['05-mgmt-logs', B.mgmtLogs], ['06-erp-integration', B.erpIntegration], ['07-ai-agent', B.aiAgent],
].filter(([, f]) => typeof f === 'function');
for (const [name, fn] of list) { fs.writeFileSync(path.join(out, name + '.svg'), fn()); console.log('작성', name + '.svg'); }
