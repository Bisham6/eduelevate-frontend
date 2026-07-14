const fs = require('fs');
const path = require('path');

const raw = process.env.API_URL || process.env.RENDER_API_URL;
if (!raw) {
  console.error('API_URL is required for Render builds.');
  console.error('Example: https://collegechuniye-api.onrender.com');
  process.exit(1);
}

const base = raw.startsWith('http') ? raw.replace(/\/$/, '') : `https://${raw.replace(/\/$/, '')}`;
const apiUrl = base.endsWith('/api/v1') ? base : `${base}/api/v1`;

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

const target = path.join(__dirname, '../src/environments/environment.prod.ts');
fs.writeFileSync(target, content, 'utf8');
console.log(`environment.prod.ts updated (apiUrl: ${apiUrl})`);
