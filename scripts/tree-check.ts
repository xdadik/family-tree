// Verifies the tidy-tree math on the REAL dataset: full coverage, sane layout,
// correct spouse/ghost wiring. Run: npx tsx scripts/tree-check.ts
import { hierarchy, tree } from 'd3-hierarchy';
import { INITIAL_MEMBERS } from '../src/data/initialData';
import { buildUnits, subtreeMembers } from '../src/utils/familyTree';

const members = INITIAL_MEMBERS;
const { units, roots, ghosts } = buildUnits(members);

// 1. every member placed exactly once
const placed = units.flatMap((u) => u.members.map((m) => m.id));
const dupes = placed.filter((id, i) => placed.indexOf(id) !== i);
console.log(`members:${members.length} placed:${placed.length} dupes:${dupes.length} missing:${members.length - new Set(placed).size}`);

// 2. single root (founders couple), all units reachable
const seen = new Set<string>();
const walk = (key: string) => {
  if (seen.has(key)) return;
  seen.add(key);
  units.find((u) => u.key === key)?.children.forEach((c) => walk(c.key));
};
roots.forEach((r) => walk(r.key));
console.log(`roots:${roots.length} [${roots.map((r) => r.members.map((m) => m.id).join('+')).join(',')}] reachable:${seen.size}/${units.length}`);

// 3. d3 layout: no NaN, min horizontal gap between same-depth nodes
interface T {
  u: string;
  kids: T[];
}
const toT = (u: (typeof units)[number]): T => ({ u: u.key, kids: u.children.map(toT) });
const h = hierarchy<T>({ u: '__root__', kids: roots.map(toT) }, (d) => d.kids);
tree<T>()
  .nodeSize([340, 252])
  .separation((a, b) => (a.parent === b.parent ? 1 : 1.3))(h);
const pts: { key: string; x: number; y: number; depth: number }[] = [];
let bad = 0;
h.each((d) => {
  if (d.data.u === '__root__') return;
  const x = d.x ?? NaN;
  if (!Number.isFinite(x)) bad++;
  pts.push({ key: d.data.u, x, y: d.depth, depth: d.depth });
});
let minGap = Infinity;
const byDepth = new Map<number, number[]>();
pts.forEach((p) => {
  const arr = byDepth.get(p.depth) || [];
  arr.push(p.x);
  byDepth.set(p.depth, arr);
});
byDepth.forEach((xs) => {
  const sorted = [...xs].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) minGap = Math.min(minGap, sorted[i] - sorted[i - 1]);
});
console.log(`nodes:${pts.length} bad-coords:${bad} min-x-gap:${Math.round(minGap)} (couple needs 292)`);
const xs = pts.map((p) => p.x);
console.log(`x-range:${Math.round(Math.min(...xs))}..${Math.round(Math.max(...xs))}`);

// 4. spouse + ghost wiring
const xu = units.find((u) => u.members.some((m) => m.id === 'xolbek'));
console.log(`xolbek-unit:${xu?.members.map((m) => m.id).join('+')} primary:${xu?.primary.id}`);
const musallamUnit = units.find((u) => u.members.some((m) => m.id === 'musallam'));
console.log(`musallam-ghosts:${(ghosts.get(musallamUnit?.key || '') || []).map((g) => g.person.id + '->' + g.targetKey).join(',')}`);
const gulbahor = units.find((u) => u.members.some((m) => m.id === 'gulbahor'));
console.log(`gulbahor-unit:${gulbahor?.members.map((m) => m.id).join('+')} kids:${gulbahor?.children.map((c) => c.members.map((m) => m.id).join('+')).join(' | ')}`);
const shax = units.find((u) => u.members.some((m) => m.id === 'shaxnoza'));
console.log(`shaxnoza-unit-kids:${shax?.children.map((c) => c.members.map((m) => m.id).join('+')).join(' | ')}`);
console.log(`dadajon-subtree:${subtreeMembers(xu!)} tursun-subtree:${subtreeMembers(units.find((u) => u.members.some((m) => m.id === 'tursun'))!)}`);
console.log('tree-check-done');
