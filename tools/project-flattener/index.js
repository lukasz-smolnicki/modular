#!/usr/bin/env node
/**
 * project-flatten — zero-deps (bez globby/minimist), Node >=18.
 * Preset: .github (tylko workflows), apps/api, apps/mobile, apps/web, packages, root.
 * Szanuje .gitignore (także zagnieżdżone). Wycina logs/ i śmieciowe rozszerzenia.
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const OUT_DIR = getArgValue('-O', '--out-dir') || 'bundles';
const PRESET = getArgValue('-p', '--preset') || 'modular';  // 'modular' | 'single'
const OUT_SINGLE = getArgValue('-o', '--out') || 'project_bundle.txt';

const MAX_TOTAL = toNumber(getArgValue(null, '--max-total'), 8_000_000);
const MAX_FILE = toNumber(getArgValue(null, '--max-file'), 300_000);
const VERBOSE = hasFlag('-v', '--verbose');
const INCLUDE_DOT = hasFlag('-d', '--dot');
const IGNORE_GITIGNORE = hasFlag('-g', '--no-gitignore');
const FOLLOW_SYMLINKS = hasFlag('-f', '--follow-symlinks');

const SEGMENTS_ALWAYS_IGNORE = [
  'node_modules', '.git', 'dist', 'build', '.next', '.expo', '.turbo', 'coverage', 'logs'
];
const EXTENSIONS_ALWAYS_IGNORE = ['.log', '.map', '.lock', '.tmp', '.bak', '.swp'];
const FILENAMES_ALWAYS_IGNORE = new Set(['.DS_Store', 'Thumbs.db']);

const EXT_TO_LANG = {
  js: 'javascript', mjs: 'javascript', cjs: 'javascript', ts: 'typescript', tsx: 'tsx', jsx: 'jsx',
  json: 'json', yml: 'yaml', yaml: 'yaml', md: 'markdown', css: 'css', scss: 'scss', less: 'less',
  html: 'html', vue: 'vue', svelte: 'svelte', rs: 'rust', go: 'go', py: 'python', rb: 'ruby', php: 'php',
  java: 'java', kt: 'kotlin', swift: 'swift', cpp: 'cpp', c: 'c', cs: 'csharp', sql: 'sql', sh: 'bash',
  dockerfile: 'dockerfile'
};
const langFrom = f => EXT_TO_LANG[path.extname(f).slice(1).toLowerCase()] || '';
const fence = lang => '```' + (lang || '');
const hdr = (rel, size) => `\n===== FILE: ${rel} (${size} bytes) =====\n`;
const nowISO = () => new Date().toISOString();

function isProbablyText(buf)
{
  const n = Math.min(buf.length, 4096);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return false;
  let weird = 0;
  for (let i = 0; i < n; i++)
  {
    const b = buf[i];
    const printable = (b >= 32 && b <= 126) || (b >= 9 && b <= 13);
    if (!printable) weird++;
  }
  return weird / Math.max(1, n) <= 0.05;
}

function hasPathSegment(relPath, seg)
{
  return relPath === seg + '/' || relPath.startsWith(seg + '/') || relPath.includes('/' + seg + '/');
}

// --- .gitignore parser (obsługa #, !, *, ?, **, /-anchor, trailing / dla katalogów) ---
function compilePattern(pattern, baseRel)
{
  pattern = pattern.replace(/\r$/, '').trim();
  if (!pattern || pattern.startsWith('#')) return null;
  let negate = false;
  if (pattern.startsWith('!')) { negate = true; pattern = pattern.slice(1); }
  const dirOnly = pattern.endsWith('/');
  const anchored = pattern.startsWith('/');

  function escRegex(s) { return s.replace(/[.+^${}()|[\]\\]/g, '\\$&'); }
  function toRegexBody(pat)
  {
    let out = ''; for (let i = 0; i < pat.length; i++)
    {
      const ch = pat[i];
      if (ch === '*') { if (pat[i + 1] === '*') { out += '.*'; i++; } else out += '[^/]*'; }
      else if (ch === '?') { out += '[^/]'; }
      else out += escRegex(ch);
    } return out;
  }

  let pat = dirOnly && pattern !== '/' ? pattern.slice(0, -1) : pattern;
  const body = toRegexBody(pat);
  let regexStr;
  if (anchored)
  {
    const base = baseRel ? ('^' + escRegex(baseRel + (baseRel ? '/' : ''))) : '^';
    regexStr = base + body + (dirOnly ? '(?:/.*)?$' : '$');
  } else
  {
    regexStr = '(^|.*/)' + body + (dirOnly ? '(?:/.*)?$' : '$');
  }
  return { negate, dirOnly, re: new RegExp(regexStr) };
}

function loadGitignoreAt(dirRel)
{
  const abs = path.join(ROOT, dirRel, '.gitignore');
  try
  {
    const content = fs.readFileSync(abs, 'utf8');
    const lines = content.split('\n');
    const rules = [];
    for (let line of lines)
    {
      const c = compilePattern(line, dirRel);
      if (c) rules.push(c);
    }
    return rules;
  } catch { return []; }
}

function isIgnored(relPath, isDir, ruleStacks)
{
  // twarde ignore dla segmentów (dowolny poziom)
  for (const seg of SEGMENTS_ALWAYS_IGNORE)
  {
    if (hasPathSegment(relPath, seg)) return true;
  }
  const base = path.basename(relPath.endsWith('/') ? relPath.slice(0, -1) : relPath);
  if (FILENAMES_ALWAYS_IGNORE.has(base)) return true;
  const ext = path.extname(relPath).toLowerCase();
  if (EXTENSIONS_ALWAYS_IGNORE.includes(ext)) return true;

  // .gitignore (ostatnie dopasowanie wygrywa)
  let ignored = false;
  for (const rules of ruleStacks)
  {
    for (const rule of rules)
    {
      if (rule.re.test(relPath))
      {
        if (rule.dirOnly && !isDir) continue;
        ignored = !rule.negate;
      }
    }
  }

  // domyślnie ukryte — ALE przepuść .github/**
  if (!INCLUDE_DOT)
  {
    if (relPath === '.github/' || relPath.startsWith('.github/'))
    {
      // przepuść .github
    } else if (base.startsWith('.'))
    {
      return true;
    }
  }

  return ignored;
}

async function walk(startRel, onFile)
{
  const stack = [];
  async function descend(dirRel)
  {
    if (!IGNORE_GITIGNORE)
    {
      const rules = loadGitignoreAt(dirRel);
      if (rules.length) stack.push(rules);
    }
    let entries;
    try
    {
      entries = await fsp.readdir(path.join(ROOT, dirRel || ''), { withFileTypes: true });
    } catch
    {
      if (!IGNORE_GITIGNORE && stack.length) stack.pop();
      return;
    }
    for (const ent of entries)
    {
      if (ent.isSymbolicLink() && !FOLLOW_SYMLINKS) continue;
      const rel = dirRel ? path.posix.join(dirRel, ent.name) : ent.name;
      const isDir = ent.isDirectory();
      const relForMatch = rel + (isDir ? '/' : '');
      if (isIgnored(relForMatch, isDir, stack)) continue;
      if (isDir) await descend(rel);
      else if (ent.isFile()) await onFile(rel);
    }
    if (!IGNORE_GITIGNORE && stack.length) stack.pop();
  }
  await descend(startRel);
}

function groupFor(rel)
{
  // .github — ZBIERAMY TYLKO workflows
  if (rel.startsWith('.github/workflows/')) return '.github';
  if (rel.startsWith('apps/api/')) return 'api';
  if (rel.startsWith('apps/mobile/')) return 'mobile';
  if (rel.startsWith('apps/web/')) return 'web';
  if (rel.startsWith('packages/')) return 'packages';
  if (!rel.includes('/')) return 'root';
  return null;
}

async function writeBundle(name, rels, outPath)
{
  if (!rels || rels.length === 0) return null; // NIE twórz pustych plików
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  const out = fs.createWriteStream(outPath, { encoding: 'utf8' });

  let total = 0;
  const tryWrite = (s) => { const b = Buffer.from(s, 'utf8'); if (total + b.length > MAX_TOTAL) return false; out.write(b); total += b.length; return true; };

  // minimalny nagłówek (bez „summary”)
  tryWrite(
    `===== BUNDLE START [${name}] =====\n` +
    `# scope: ${name}\n` +
    (name === 'api' ? `# path: apps/api\n` :
      name === 'mobile' ? `# path: apps/mobile\n` :
        name === 'web' ? `# path: apps/web\n` :
          name === 'packages' ? `# path: packages\n` :
            name === '.github' ? `# path: .github/workflows\n` : `# path: /\n`) +
    `# generated: ${nowISO()}\n\n`
  );

  for (const rel of rels)
  {
    const abs = path.join(ROOT, rel);
    let st; try { st = await fsp.stat(abs); } catch { continue; }
    if (!st.isFile()) continue;
    if (st.size > MAX_FILE) { if (VERBOSE) tryWrite(hdr(rel, st.size) + `[SKIPPED: file too large]\n`); continue; }
    let buf; try { buf = await fsp.readFile(abs); } catch { continue; }
    if (!isProbablyText(buf)) { if (VERBOSE) tryWrite(hdr(rel, st.size) + `[SKIPPED: binary file]\n`); continue; }
    const section = hdr(rel, st.size) + fence(langFrom(rel)) + '\n' + buf.toString('utf8') + '\n```\n';
    if (!tryWrite(section)) { /* opcjonalnie: tryWrite(`\n[STOP: reached max-total ${MAX_TOTAL} bytes]\n`); */ break; }
  }

  out.end(); await new Promise(res => out.on('finish', res));
  return { total };
}

function getArgValue(shortFlag, longFlag)
{
  const argv = process.argv.slice(2);
  if (shortFlag) { const i = argv.indexOf(shortFlag); if (i !== -1) return argv[i + 1]; }
  if (longFlag) { const i = argv.indexOf(longFlag); if (i !== -1) return argv[i + 1]; }
  return null;
}
function hasFlag(shortFlag, longFlag)
{
  const argv = process.argv.slice(2);
  return (shortFlag && argv.includes(shortFlag)) || (longFlag && argv.includes(longFlag));
}
function toNumber(v, def) { if (!v) return def; return Number(String(v).replaceAll('_', '')); }

// ---- main ----
(async function main()
{
  const all = [];
  await walk('', async (rel) => { all.push(rel.replace(/\\/g, '/')); });

  if (PRESET === 'single')
  {
    const outFile = path.resolve(ROOT, OUT_SINGLE);
    const r = await writeBundle('all', all, outFile);
    if (r) console.log(`✔ all: ${outFile}`);
    else console.log('✱ all: brak plików do zapisania');
    return;
  }

  const groups = new Map([
    ['.github', []], ['api', []], ['mobile', []],
    ['web', []], ['packages', []], ['root', []]
  ]);
  for (const rel of all)
  {
    const g = groupFor(rel);
    if (g && groups.has(g)) groups.get(g).push(rel);
  }

  const outDir = path.resolve(ROOT, OUT_DIR);
  for (const [name, rels] of groups.entries())
  {
    const outPath = path.join(outDir, `bundle_${name.replace(/[^\w.-]+/g, '_')}.txt`);
    const r = await writeBundle(name, rels, outPath);
    if (r) console.log(`✔ ${name}: ${outPath}`);
  }
  console.log('\nGotowe ✔  Paczki w:', outDir);
})().catch((err) =>
{
  const msg = (err && err.message) ? err.message : err;
  console.error('Błąd:', msg);
  process.exit(1);
});
