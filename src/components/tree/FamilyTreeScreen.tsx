import React, { useState, useMemo, useRef, useEffect } from 'react';
import { hierarchy, tree } from 'd3-hierarchy';
import { ZoomIn, ZoomOut, Crosshair, User, ChevronRight, Plus } from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types/family';
import { Avatar } from '../common/Avatar';
import { Unit, buildUnits, subtreeMembers, lifespan } from '../../utils/familyTree';

const UNIT_W_SINGLE = 136;
const UNIT_W_COUPLE = 292;
const UNIT_H = 176;
const NODE_DX = 340;
const NODE_DY = 252;

interface TNode {
  unit: Unit | null;
  kids: TNode[];
}

export const FamilyTreeScreen: React.FC = () => {
  const {
    members,
    openMemberProfile,
    openAddMemberWithRelation,
    setSelectedMemberId,
    isAdmin,
    currentUser,
    treeViewMode,
    setTreeViewMode,
    setIsAddMemberOpen,
    setEditingMember,
    setAddMemberPreset,
    setIsLoginModalOpen,
    theme,
    canvasBg,
    t,
  } = useFamily();

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [zoom, setZoom] = useState(0.6);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const laidRef = useRef<{ key: string; x: number; y: number }[]>([]);

  const { roots, ghosts } = useMemo(() => {
    const { roots: r, ghosts: g } = buildUnits(members);
    return { roots: r, ghosts: g };
  }, [members]);

  const collapsedSet = useMemo(() => {
    const s = new Set<string>();
    Object.entries(collapsed).forEach(([k, v]) => v && s.add(k));
    return s;
  }, [collapsed]);

  // d3 tidy layout over the unit tree (virtual root keeps multi-root families aligned)
  const laid = useMemo(() => {
    const toT = (u: Unit): TNode => ({
      unit: u,
      kids: collapsedSet.has(u.key) ? [] : u.children.map(toT),
    });
    const virtual: TNode = { unit: null, kids: roots.map(toT) };
    const h = hierarchy<TNode>(virtual, (d) => d.kids);
    tree<TNode>()
      .nodeSize([NODE_DX, NODE_DY])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.3))(h);
    const nodes: { key: string; unit: Unit; x: number; y: number; parentKey: string | null; hidden: number }[] = [];
    h.each((d) => {
      if (!d.data.unit) return;
      const total = subtreeMembers(d.data.unit);
      const visible = (() => {
        let n = 0;
        const walk = (t: TNode) => {
          if (t.unit) n += t.unit.members.length;
          t.kids.forEach(walk);
        };
        walk(d.data);
        return n;
      })();
      nodes.push({
        key: d.data.unit.key,
        unit: d.data.unit,
        x: d.x ?? 0,
        y: (d.depth - 1) * NODE_DY + 60,
        parentKey: d.parent && d.parent.data.unit ? d.parent.data.unit.key : null,
        hidden: Math.max(0, total - visible),
      });
    });
    return nodes;
  }, [roots, collapsedSet]);

  useEffect(() => {
    laidRef.current = laid.map((n) => ({ key: n.key, x: n.x, y: n.y }));
  }, [laid]);

  const byKey = useMemo(() => new Map(laid.map((n) => [n.key, n])), [laid]);

  // Fit founders on first mount
  useEffect(() => {
    if (containerRef.current && laid.length > 0) {
      const top = laid.filter((n) => n.y <= 60 + NODE_DY);
      const xs = top.flatMap((n) => {
        const w = n.unit.members.length > 1 ? UNIT_W_COUPLE : UNIT_W_SINGLE;
        return [n.x - w / 2, n.x + w / 2];
      });
      if (xs.length > 0) {
        const { clientWidth } = containerRef.current;
        const span = Math.max(...xs) - Math.min(...xs) + 120;
        const z = Math.min(Math.max(clientWidth / span, 0.25), 1);
        const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
        setZoom(z);
        setPan({ x: clientWidth / 2 - midX * z, y: 60 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerOn = (x: number, y: number, z?: number) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const nz = z ?? zoom;
    setZoom(nz);
    setPan({ x: clientWidth / 2 - x * nz, y: clientHeight / 2.4 - y * nz });
  };

  const centerUnit = (key: string) => {
    const n = byKey.get(key);
    if (n) centerOn(n.x, n.y, Math.max(zoom, 0.85));
  };

  // Pan / zoom gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tree-card') || (e.target as HTMLElement).closest('.tree-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.tree-card') || (e.target as HTMLElement).closest('.tree-control')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      touchStartRef.current.dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({ x: e.touches[0].clientX - touchStartRef.current.x, y: e.touches[0].clientY - touchStartRef.current.y });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const ratio = dist / touchStartRef.current.dist;
      setZoom((z) => Math.min(Math.max(z * (ratio > 1 ? 1.02 : 0.98), 0.25), 2.2));
      touchStartRef.current.dist = dist;
    }
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.min(Math.max(z + (e.deltaY < 0 ? 0.08 : -0.08), 0.25), 2.2));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [treeViewMode]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.25));
  const handleCenter = () => {
    if (laid.length === 0 || !containerRef.current) return;
    const xs = laid.map((n) => n.x);
    const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const { clientWidth } = containerRef.current;
    const span = Math.max(...xs) - Math.min(...xs) + 200;
    const z = Math.min(Math.max(clientWidth / span, 0.25), 1);
    setZoom(z);
    setPan({ x: clientWidth / 2 - midX * z, y: 60 });
  };
  const handleMyPosition = () => {
    const myId = currentUser?.familyMemberId;
    const mine = myId ? laid.find((n) => n.unit.members.some((m) => m.id === myId)) : laid[0];
    const target = mine || laid[0];
    if (target) {
      centerOn(target.x, target.y, 1);
      if (myId) setSelectedMemberId(myId);
    }
  };

  const toggleCollapse = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDark = theme === 'dark';
  const hairline = isDark ? '#8a715a' : '#b49b78';
  const canvasColor =
    canvasBg === 'slate' || canvasBg === 'black'
      ? '#1c1917'
      : canvasBg === 'cream' || canvasBg === 'white'
        ? '#faf6ee'
        : isDark
          ? '#1c1917'
          : '#faf6ee';
  const dotColor = isDark ? 'rgba(255,255,255,0.055)' : 'rgba(60,40,20,0.06)';

  const unitWidth = (u: Unit) => (u.members.length > 1 ? UNIT_W_COUPLE : UNIT_W_SINGLE);

  const linkPath = (x1: number, y1: number, x2: number, y2: number) => {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  };

  if (members.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <img src="/logo.jpg" alt="Shajara" className="w-20 h-20 rounded-3xl object-cover shadow-lg" />
        <div className="space-y-1 max-w-xs">
          <h3 className="font-display text-lg text-neutral-900 dark:text-white">{t.noMembersYet}</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">{t.noMembersDesc}</p>
        </div>
        {isAdmin ? (
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
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="btn-gold min-h-[44px] px-4 rounded-xl text-xs font-bold active:scale-95 transition-all"
          >
            {t.login}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden transition-colors select-none">
      {/* Title chip + admin add */}
      <div className="tree-control absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="font-display text-sm leading-none text-neutral-900 dark:text-white">{t.tree}</div>
          <div className="font-mono2 text-[10px] text-neutral-500 mt-0.5">
            {members.length} {t.members}
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingMember(null);
              setAddMemberPreset(null);
              setIsAddMemberOpen(true);
            }}
            className="btn-gold pointer-events-auto min-h-[44px] px-3 rounded-2xl text-xs font-bold active:scale-95 transition-all"
          >
            + {t.addMember}
          </button>
        )}
      </div>

      {/* Tidy tree canvas */}
      {treeViewMode === 'tree' && (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            touchAction: 'none',
            backgroundColor: canvasColor,
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
          className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing transition-colors"
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="absolute top-0 left-0 w-0 h-0"
          >
            <svg className="overflow-visible pointer-events-none absolute top-0 left-0" style={{ width: 1, height: 1 }}>
              {laid.map((n) => {
                if (!n.parentKey) return null;
                const p = byKey.get(n.parentKey);
                if (!p) return null;
                return (
                  <path
                    key={`link-${n.key}`}
                    d={linkPath(p.x, p.y + UNIT_H / 2, n.x, n.y - UNIT_H / 2)}
                    stroke={hairline}
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {laid.map((n) => {
              const w = unitWidth(n.unit);
              return (
                <div
                  key={n.key}
                  style={{ transform: `translate(${n.x - w / 2}px, ${n.y - UNIT_H / 2}px)`, width: `${w}px` }}
                  className="tree-card absolute rounded-xl bg-[#fffdf7] dark:bg-[#262019] border border-[#ddd2bd] dark:border-[#453a2c] shadow-[0_10px_24px_-18px_rgba(60,40,20,0.45)] px-2 pt-2 pb-1.5"
                >
                  <div className={`grid ${n.unit.members.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
                    {n.unit.members.map((m) => {
                      const by = m.birthYear && m.birthYear > 0 ? m.birthYear : 0;
                      const dy = m.deathYear && m.deathYear > 0 ? m.deathYear : 0;
                      const life = !by ? '—' : m.isLiving ? `${by} –` : dy ? `${by} – ${dy}` : `${by} – ?`;
                      const isMe = !!currentUser?.familyMemberId && m.id === currentUser.familyMemberId;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedMemberId(m.id);
                            openMemberProfile(m.id);
                          }}
                          className="flex flex-col items-center text-center rounded-lg hover:bg-[#f6efe0] dark:hover:bg-[#2e2620] active:scale-[0.98] transition-all py-1 min-h-[44px]"
                        >
                          <span className="relative">
                            <Avatar src={m.avatarUrl} name={m.fullName} size="sm" />
                            {isMe && (
                              <span className="absolute -bottom-1 -right-2 px-1 rounded-full font-mono2 text-[8px] font-bold bg-[#1c1917] text-[#faf6ee] dark:bg-[#e8c88a] dark:text-[#1c1917]">
                                {t.you}
                              </span>
                            )}
                          </span>
                          <span className="font-mono2 text-[8px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400 truncate max-w-full mt-1">
                            {m.relationLabel}
                          </span>
                          <span className="font-display text-[12px] leading-tight text-neutral-900 dark:text-[#faf6ee] line-clamp-1 w-full">
                            {m.fullName}
                          </span>
                          <span className="font-mono2 text-[9px] text-neutral-600 dark:text-neutral-300">{life}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    {(ghosts.get(n.key) || []).map((g) => (
                      <button
                        key={g.person.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          centerUnit(g.targetKey);
                          setSelectedMemberId(g.person.id);
                        }}
                        title={g.person.fullName}
                        className="min-h-[28px] px-2 rounded-full border border-dashed border-[#b49b78] dark:border-[#8a715a] font-mono2 text-[9px] text-neutral-500 dark:text-neutral-400 hover:text-[#8a6d2f] transition-all"
                      >
                        ⤴ {g.person.fullName.split(' ')[0]}
                      </button>
                    ))}
                    {n.unit.children.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCollapsed((prev) => ({ ...prev, [n.key]: !prev[n.key] }));
                        }}
                        aria-expanded={!collapsed[n.key]}
                        className="min-h-[32px] px-2 rounded-full bg-[#f3e8cf] dark:bg-[#3a2f22] font-mono2 text-[10px] font-bold text-[#7c4a21] dark:text-[#e8c88a] active:scale-90 transition-all"
                      >
                        {collapsed[n.key] ? `+${n.hidden || n.unit.children.length}` : '–'}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddMemberWithRelation(n.unit.primary, 'child');
                        }}
                        title={t.addChild}
                        aria-label={`${t.addChild}`}
                        className="min-h-[32px] min-w-[32px] rounded-full border border-[#ddd2bd] dark:border-[#453a2c] text-neutral-400 hover:text-[#8a6d2f] hover:border-[#8a6d2f] text-[14px] font-bold transition-all active:scale-95"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* Canvas controls */}
      {treeViewMode === 'tree' && (
        <div className="tree-control absolute right-4 bottom-20 z-30 flex flex-col items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center active:scale-95 transition-transform"
            aria-label={t.zoomIn}
            title={t.zoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center active:scale-95 transition-transform"
            aria-label={t.zoomOut}
            title={t.zoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleCenter}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center active:scale-95 transition-transform"
            aria-label={t.centerCanvas}
            title={t.centerCanvas}
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={handleMyPosition}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border border-neutral-950 dark:border-white shadow-md flex items-center justify-center active:scale-95 transition-transform"
            aria-label={t.myPosition}
            title={t.myPosition}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode switcher */}
      <div className="tree-control absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
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
