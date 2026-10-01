import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Heart } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types/family';
import { Avatar } from '../common/Avatar';

const lifespan = (m: FamilyMember): string => {
  const by = m.birthYear && m.birthYear > 0 ? m.birthYear : 0;
  const dy = m.deathYear && m.deathYear > 0 ? m.deathYear : 0;
  if (!by) return '—';
  if (m.isLiving) return `${by} –`;
  return dy ? `${by} – ${dy}` : `${by} – ?`;
};

interface FamilyGroupProps {
  parentIds: string[];
  depth: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
}

const FamilyGroup: React.FC<FamilyGroupProps> = ({ parentIds, depth, expanded, toggle }) => {
  const {
    members,
    openMemberProfile,
    openAddMemberWithRelation,
    isAdmin,
    t,
  } = useFamily();

  const byId = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);
  const parents = parentIds
    .map((id) => byId.get(id))
    .filter((m): m is FamilyMember => !!m);
  if (parents.length === 0) return null;

  // One shared children list for the whole couple (dedupe, oldest first)
  const childIds = Array.from(
    new Set(parents.flatMap((p) => p.childrenIds || [])),
  ).filter((id) => byId.has(id));
  const children = childIds
    .map((id) => byId.get(id) as FamilyMember)
    .sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999));

  const primary = parents[0];

  return (
    <section className={depth > 0 ? 'mt-1' : ''}>
      {/* Parents card — couple side by side, like the brand board */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-3">
        <div className={`grid ${parents.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          {parents.map((p) => (
            <button
              key={p.id}
              onClick={() => openMemberProfile(p.id)}
              className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 active:scale-[0.99] transition-all text-left min-h-[56px]"
            >
              <Avatar src={p.avatarUrl} name={p.fullName} size="md" />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-neutral-900 dark:text-white truncate">
                  {p.fullName}
                </span>
                <span className="block font-mono2 text-[11px] text-neutral-500">
                  {p.relationLabel} · {lifespan(p)}
                </span>
              </span>
            </button>
          ))}
        </div>

        {parents.length > 1 && (
          <div className="flex items-center gap-2 mt-1 text-neutral-300 dark:text-neutral-600" aria-hidden="true">
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            <Heart className="w-3 h-3 text-[#C2A772]" />
            <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          </div>
        )}

        {isAdmin && (
          <button
            onClick={() => openAddMemberWithRelation(primary, 'child')}
            className="mt-1.5 w-full min-h-[40px] rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-500 hover:text-[#8a6d2f] hover:border-[#C2A772] dark:hover:text-[#e8c88a] transition-all"
          >
            + {t.addChild}
          </button>
        )}
      </div>

      {/* Children rows on a sage rail */}
      {children.length > 0 && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#A9B297]/60 dark:border-[#A9B297]/30 pl-2">
          {children.map((c) => {
            const grandkids = (c.childrenIds || []).filter((id) => byId.has(id)).length;
            const isOpen = !!expanded[c.id];
            return (
              <div key={c.id}>
                <div className="flex items-center gap-1 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm pr-1">
                  <button
                    onClick={() => openMemberProfile(c.id)}
                    className="flex-1 flex items-center gap-3 rounded-2xl p-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 active:scale-[0.99] transition-all text-left min-h-[60px] min-w-0"
                  >
                    <Avatar src={c.avatarUrl} name={c.fullName} size="md" />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {c.fullName}
                      </span>
                      <span className="block font-mono2 text-[11px] text-neutral-500">
                        {c.relationLabel} · {lifespan(c)}
                        {grandkids > 0 ? ` · +${grandkids}` : ''}
                      </span>
                    </span>
                  </button>
                  {grandkids > 0 ? (
                    <button
                      onClick={() => toggle(c.id)}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? t.close : t.addChild}
                      className="min-w-[44px] min-h-[44px] rounded-xl text-neutral-400 hover:text-[#8a6d2f] dark:hover:text-[#e8c88a] hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center active:scale-95 transition-all shrink-0"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => openMemberProfile(c.id)}
                      aria-label={t.viewProfile}
                      className="min-w-[44px] min-h-[44px] rounded-xl text-neutral-300 dark:text-neutral-600 hover:text-[#8a6d2f] flex items-center justify-center shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isOpen && grandkids > 0 && (
                  <div className="ml-2 animate-fade-in">
                    <NestedFamily memberId={c.id} depth={depth + 1} expanded={expanded} toggle={toggle} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

const NestedFamily: React.FC<{
  memberId: string;
  depth: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
}> = ({ memberId, depth, expanded, toggle }) => {
  const { members } = useFamily();
  const member = members.find((m) => m.id === memberId);
  if (!member) return null;
  // The member plus their spouse (if any) head the nested family
  const parentIds = member.spouseId ? [member.id, member.spouseId] : [member.id];
  return <FamilyGroup parentIds={parentIds} depth={depth} expanded={expanded} toggle={toggle} />;
};

export const FamilyTreeScreen: React.FC = () => {
  const {
    members,
    treeViewMode,
    setTreeViewMode,
    setIsAddMemberOpen,
    setEditingMember,
    setAddMemberPreset,
    openMemberProfile,
    isAdmin,
    t,
  } = useFamily();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const generationsCount = useMemo(
    () => new Set(members.map((m) => m.generation || 1)).size || 1,
    [members],
  );

  // Roots = eldest generation present (the founders), oldest first
  const roots = useMemo(() => {
    if (members.length === 0) return [];
    const minGen = Math.min(...members.map((m) => m.generation || 1));
    return members
      .filter((m) => (m.generation || 1) === minGen)
      .sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999));
  }, [members]);

  // Founder couple as one group, other roots as their own groups
  const rootGroups = useMemo(() => {
    const used = new Set<string>();
    const groups: string[][] = [];
    roots.forEach((m) => {
      if (used.has(m.id)) return;
      const spouse = m.spouseId ? roots.find((s) => s.id === m.spouseId) : undefined;
      if (spouse && !used.has(spouse.id)) {
        const pair = m.gender === 'female' && spouse.gender === 'male' ? [spouse.id, m.id] : [m.id, spouse.id];
        groups.push(pair);
        used.add(m.id);
        used.add(spouse.id);
      } else {
        groups.push([m.id]);
        used.add(m.id);
      }
    });
    return groups;
  }, [roots]);

  if (members.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <img src="/logo.jpg" alt="Shajara" className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
        <div className="space-y-1 max-w-xs">
          <h3 className="font-display text-lg text-neutral-900 dark:text-white">{t.noMembersYet}</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">{t.noMembersDesc}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingMember(null);
              setAddMemberPreset(null);
              setIsAddMemberOpen(true);
            }}
            className="btn-gold min-h-[44px] px-4 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            {t.addFirstMember}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col overflow-hidden">
      {/* Brand hero strip, like the board */}
      <div className="px-4 pt-4 pb-2">
        <div className="paper-surface rounded-2xl border border-[#e7ddc8] dark:border-[#3a3128] p-3 flex items-center gap-3">
          <img src="/logo.jpg" alt="Shajara" className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base leading-tight text-neutral-900 dark:text-white truncate">
              {t.ourFamilyTree}
            </h2>
            <p className="font-mono2 text-[10px] text-neutral-500">
              {members.length} {t.members} · {generationsCount} {t.generations}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingMember(null);
                setAddMemberPreset(null);
                setIsAddMemberOpen(true);
              }}
              className="btn-gold min-h-[40px] px-3 rounded-xl text-xs font-bold shrink-0"
            >
              + {t.addMember}
            </button>
          )}
        </div>
      </div>

      {/* Explorer — normal page scroll, tap rows, expand families */}
      {treeViewMode === 'tree' && (
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-1 space-y-3">
        {rootGroups.map((group, i) => (
          <FamilyGroup key={group.join('-') + i} parentIds={group} depth={0} expanded={expanded} toggle={toggle} />
        ))}
      </div>
      )}

      {/* Flat list by generation */}
      {treeViewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((gen) => {
            const genMembers = members.filter((m) => (m.generation || 1) === gen);
            if (genMembers.length === 0) return null;
            return (
              <div key={gen} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-[#8a6d2f] dark:text-[#e8c88a]">
                    {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][gen - 1]}
                  </span>
                  <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {t.generations}
                  </h3>
                  <span className="font-mono2 text-[10px] text-neutral-400">({genMembers.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {genMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => openMemberProfile(m.id)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 active:scale-[0.99] transition-all text-left min-h-[56px]"
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Avatar src={m.avatarUrl} name={m.fullName} size="md" />
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-neutral-900 dark:text-white truncate">
                            {m.fullName}
                          </span>
                          <span className="block font-mono2 text-[11px] text-neutral-500 truncate">
                            {m.relationLabel} · {lifespan(m)}
                          </span>
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode switcher */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center p-1 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-lg transition-colors">
          <button
            onClick={() => setTreeViewMode('tree')}
            aria-pressed={treeViewMode === 'tree'}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              treeViewMode === 'tree'
                ? 'bg-[#1c1917] text-[#faf6ee] dark:bg-[#faf6ee] dark:text-[#1c1917] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t.treeView}
          </button>
          <button
            onClick={() => setTreeViewMode('list')}
            aria-pressed={treeViewMode === 'list'}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              treeViewMode === 'list'
                ? 'bg-[#1c1917] text-[#faf6ee] dark:bg-[#faf6ee] dark:text-[#1c1917] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t.listView}
          </button>
        </div>
      </div>
    </div>
  );
};
