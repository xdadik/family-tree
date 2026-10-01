import { FamilyMember } from '../types/family';

export interface Unit {
  key: string;
  members: FamilyMember[]; // display order: male on the left
  primary: FamilyMember; // attachment anchor for the tree
  children: Unit[];
}

export interface Ghost {
  person: FamilyMember;
  targetKey: string;
}

export const lifespan = (m: FamilyMember): string => {
  const by = m.birthYear && m.birthYear > 0 ? m.birthYear : 0;
  const dy = m.deathYear && m.deathYear > 0 ? m.deathYear : 0;
  if (!by) return '—';
  if (m.isLiving) return `${by} –`;
  return dy ? `${by} – ${dy}` : `${by} – ?`;
};

export function buildUnits(members: FamilyMember[]): {
  units: Unit[];
  roots: Unit[];
  ghosts: Map<string, Ghost[]>;
} {
  const byId = new Map(members.map((m) => [m.id, m]));
  const inSet = (id: string) => byId.has(id);
  const units = new Map<string, Unit>();
  const memberUnit = new Map<string, string>();
  const processed = new Set<string>();

  const pairKey = (a: string, b: string) => `u_${[a, b].sort().join('_')}`;

  members.forEach((m) => {
    if (processed.has(m.id)) return;
    const spouse = m.spouseId && inSet(m.spouseId) ? byId.get(m.spouseId) : undefined;
    if (spouse && !processed.has(spouse.id)) {
      const ordered = m.gender === 'female' && spouse.gender === 'male' ? [spouse, m] : [m, spouse];
      const key = pairKey(m.id, spouse.id);
      const withParents = ordered.filter((p) => (p.parentIds || []).some((pid) => inSet(pid)));
      const primary =
        withParents.length === 1
          ? withParents[0]
          : ordered.find((p) => p.gender === 'male') || ordered[0];
      units.set(key, { key, members: ordered, primary, children: [] });
      memberUnit.set(m.id, key);
      memberUnit.set(spouse.id, key);
      processed.add(m.id);
      processed.add(spouse.id);
    } else {
      const key = `u_${m.id}`;
      units.set(key, { key, members: [m], primary: m, children: [] });
      memberUnit.set(m.id, key);
      processed.add(m.id);
    }
  });

  // Attach child units under the unit holding their parents
  units.forEach((unit) => {
    const parentIds = new Set<string>();
    unit.members.forEach((m) => (m.parentIds || []).forEach((pid) => inSet(pid) && parentIds.add(pid)));
    const homeKeys = new Set(
      [...parentIds]
        .map((pid) => memberUnit.get(pid))
        .filter((k): k is string => !!k && k !== unit.key),
    );
    const anchorParents = (unit.primary.parentIds || []).filter((pid) => inSet(pid));
    let home: string | undefined;
    for (const pid of anchorParents) {
      const k = memberUnit.get(pid);
      if (k && k !== unit.key) {
        home = k;
        break;
      }
    }
    if (!home && homeKeys.size > 0) {
      const anchorSet = new Set(anchorParents);
      home =
        [...homeKeys].find((k) => {
          const u = units.get(k);
          return u && u.members.some((m) => anchorSet.has(m.id));
        }) || [...homeKeys][0];
    }
    if (home) {
      const parent = units.get(home);
      if (parent && !parent.children.some((c) => c.key === unit.key)) parent.children.push(unit);
    }
  });

  // Order siblings oldest-first so limbs read naturally
  units.forEach((unit) => {
    unit.children.sort((a, b) => {
      const ya = Math.min(...a.members.map((m) => m.birthYear || 9999));
      const yb = Math.min(...b.members.map((m) => m.birthYear || 9999));
      return ya - yb;
    });
  });

  const roots = [...units.values()].filter(
    (u) =>
      !(u.primary.parentIds || []).some((pid) => {
        const k = memberUnit.get(pid);
        return k && k !== u.key;
      }),
  );

  // Ghosts: married-in spouses still shown (dimmed) in their birth family
  const ghosts = new Map<string, Ghost[]>();
  units.forEach((unit) => {
    unit.members.forEach((m) => {
      if (m.id === unit.primary.id) return;
      let birthUnitKey: string | undefined;
      for (const pid of m.parentIds || []) {
        const k = memberUnit.get(pid);
        if (k && k !== unit.key) {
          birthUnitKey = k;
          break;
        }
      }
      if (!birthUnitKey) return;
      const list = ghosts.get(birthUnitKey) || [];
      if (!list.some((g) => g.person.id === m.id)) list.push({ person: m, targetKey: unit.key });
      ghosts.set(birthUnitKey, list);
    });
  });

  return { units: [...units.values()], roots, ghosts };
}

export const subtreeMembers = (unit: Unit): number => {
  let n = unit.members.length;
  unit.children.forEach((c) => {
    n += subtreeMembers(c);
  });
  return n;
};
