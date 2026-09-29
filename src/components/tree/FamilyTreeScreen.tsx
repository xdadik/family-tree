import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  User,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Check,
  Search,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, TreeViewMode } from '../../types/family';

interface NodeLayout {
  member: FamilyMember;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FamilyTreeScreen: React.FC = () => {
  const {
    members,
    selectedMemberId,
    openMemberProfile,
    currentUser,
    treeViewMode,
    setTreeViewMode,
    setIsAddMemberOpen,
    setActiveTab,
  } = useFamily();

  // Canvas pan and zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Tree filter
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'elders' | 'youth'>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});
  const [searchTreeTerm, setSearchTreeTerm] = useState('');

  // Initial centering
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({ x: clientWidth / 2, y: 80 });
      setZoom(0.95);
    }
  }, []);

  // Filter members if filter applied
  const filteredMembers = useMemo(() => {
    if (activeFilter === 'elders') {
      return members.filter((m) => m.generation === 1);
    }
    if (activeFilter === 'direct') {
      // Direct lineage of currentUser (Rashid)
      return members.filter((m) => ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].includes(m.id));
    }
    if (activeFilter === 'youth') {
      return members.filter((m) => m.generation === 3);
    }
    return members;
  }, [members, activeFilter]);

  // Layout Computation: Group into Generations
  // Gen 1: Abdulla & Saida
  // Gen 2: Rashid & Zarina, Jamshid & Nigora
  // Gen 3: Children
  const layout = useMemo(() => {
    const CARD_W = 120;
    const CARD_H = 140;
    const GEN_Y_GAP = 160;
    const SPOUSE_GAP = 40;
    const SIBLING_GAP = 40;

    const nodePositions: Record<string, NodeLayout> = {};

    // Generation 1: Abdulla (m1) & Saida (m2), plus Lola (m12)
    const gen1Members = filteredMembers.filter((m) => m.generation === 1);
    const g1Y = 30;
    // Center pair
    const m1 = gen1Members.find((m) => m.id === 'm1');
    const m2 = gen1Members.find((m) => m.id === 'm2');

    if (m1) {
      nodePositions[m1.id] = {
        member: m1,
        x: -CARD_W - SPOUSE_GAP / 2,
        y: g1Y,
        width: CARD_W,
        height: CARD_H,
      };
    }
    if (m2) {
      nodePositions[m2.id] = {
        member: m2,
        x: SPOUSE_GAP / 2,
        y: g1Y,
        width: CARD_W,
        height: CARD_H,
      };
    }

    // Lola (Great Aunt) placed slightly to right
    const m12 = gen1Members.find((m) => m.id === 'm12');
    if (m12) {
      nodePositions[m12.id] = {
        member: m12,
        x: CARD_W + SPOUSE_GAP * 2,
        y: g1Y,
        width: CARD_W,
        height: CARD_H,
      };
    }

    // Generation 2: Rashid & Zarina (Branch A), Jamshid & Nigora (Branch B)
    const g2Y = g1Y + GEN_Y_GAP;
    const m3 = filteredMembers.find((m) => m.id === 'm3'); // Rashid
    const m4 = filteredMembers.find((m) => m.id === 'm4'); // Zarina
    const m8 = filteredMembers.find((m) => m.id === 'm8'); // Jamshid
    const m9 = filteredMembers.find((m) => m.id === 'm9'); // Nigora

    // Branch A (Rashid & Zarina) centered slightly left
    if (m3) {
      nodePositions[m3.id] = {
        member: m3,
        x: -CARD_W - 15,
        y: g2Y,
        width: CARD_W,
        height: CARD_H,
      };
    }
    if (m4) {
      nodePositions[m4.id] = {
        member: m4,
        x: 15,
        y: g2Y,
        width: CARD_W,
        height: CARD_H,
      };
    }

    // Branch B (Jamshid & Nigora) placed to the right
    if (m8) {
      nodePositions[m8.id] = {
        member: m8,
        x: CARD_W * 2 + 10,
        y: g2Y,
        width: CARD_W,
        height: CARD_H,
      };
    }
    if (m9) {
      nodePositions[m9.id] = {
        member: m9,
        x: CARD_W * 3 + 30,
        y: g2Y,
        width: CARD_W,
        height: CARD_H,
      };
    }

    // Generation 3:
    // Rashid & Zarina's children: Ali (m5), Aisha (m6), Omar (m7)
    const g3Y = g2Y + GEN_Y_GAP;
    const rChildren = [
      filteredMembers.find((m) => m.id === 'm5'),
      filteredMembers.find((m) => m.id === 'm6'),
      filteredMembers.find((m) => m.id === 'm7'),
    ].filter(Boolean) as FamilyMember[];

    const isRashidCollapsed = collapsedBranches['m3'];

    if (!isRashidCollapsed) {
      const rTotalWidth = rChildren.length * CARD_W + (rChildren.length - 1) * SIBLING_GAP;
      let startX = -rTotalWidth / 2;
      rChildren.forEach((child) => {
        nodePositions[child.id] = {
          member: child,
          x: startX,
          y: g3Y,
          width: CARD_W,
          height: CARD_H,
        };
        startX += CARD_W + SIBLING_GAP;
      });
    }

    // Jamshid's children: Diyor (m10), Malika (m11)
    const jChildren = [
      filteredMembers.find((m) => m.id === 'm10'),
      filteredMembers.find((m) => m.id === 'm11'),
    ].filter(Boolean) as FamilyMember[];

    const isJamshidCollapsed = collapsedBranches['m8'];

    if (!isJamshidCollapsed) {
      let jStartX = CARD_W * 2 - 20;
      jChildren.forEach((child) => {
        nodePositions[child.id] = {
          member: child,
          x: jStartX,
          y: g3Y,
          width: CARD_W,
          height: CARD_H,
        };
        jStartX += CARD_W + SIBLING_GAP;
      });
    }

    // Position any other dynamically added members
    filteredMembers.forEach((m) => {
      if (!nodePositions[m.id]) {
        // Place in their generation line or bottom
        const genY = g1Y + (m.generation - 1) * GEN_Y_GAP;
        nodePositions[m.id] = {
          member: m,
          x: -CARD_W * 2.5 + Object.keys(nodePositions).length * 40,
          y: genY,
          width: CARD_W,
          height: CARD_H,
        };
      }
    });

    return nodePositions;
  }, [filteredMembers, collapsedBranches]);

  // Touch and Mouse handlers for pan & zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tree-card') || (e.target as HTMLElement).closest('.tree-control')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.tree-card') || (e.target as HTMLElement).closest('.tree-control')) {
      return;
    }
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartRef.current.dist;
      setZoom((z) => Math.min(Math.max(z * (ratio > 1 ? 1.03 : 0.97), 0.5), 2.2));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  // Controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.45));

  const handleCenter = () => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setPan({ x: clientWidth / 2, y: 70 });
      setZoom(0.95);
    }
  };

  const handleMyPosition = () => {
    // Current user is linked to Rashid (m3) or Aisha (m6)
    const targetNode = layout['m3'] || layout['m6'] || Object.values(layout)[0];
    if (targetNode && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({
        x: clientWidth / 2 - targetNode.x - targetNode.width / 2,
        y: clientHeight / 2 - targetNode.y - targetNode.height / 2,
      });
      setZoom(1.1);
    }
  };

  const toggleBranch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedBranches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Tree connection lines calculation
  const connectionLines = useMemo(() => {
    const lines: React.ReactNode[] = [];

    // 1. Abdulla (m1) & Saida (m2) marriage link
    const n1 = layout['m1'];
    const n2 = layout['m2'];
    if (n1 && n2) {
      const c1X = n1.x + n1.width;
      const c1Y = n1.y + n1.height / 2;
      const c2X = n2.x;
      const c2Y = n2.y + n2.height / 2;
      const midG1X = (c1X + c2X) / 2;
      const midG1Y = c1Y;

      // Horizontal marriage line
      lines.push(
        <line
          key="mar-m1-m2"
          x1={c1X}
          y1={c1Y}
          x2={c2X}
          y2={c2Y}
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );

      // Downward line from Grandparents marriage to Gen 2
      const n3 = layout['m3']; // Rashid
      const n8 = layout['m8']; // Jamshid
      const branchDropY = midG1Y + 50;

      lines.push(
        <path
          key="drop-g1"
          d={`M ${midG1X} ${midG1Y} V ${branchDropY}`}
          stroke="#10B981"
          strokeWidth="2.5"
          fill="none"
        />
      );

      // Branch to Rashid (m3)
      if (n3) {
        const rTopX = n3.x + n3.width / 2;
        const rTopY = n3.y;
        lines.push(
          <path
            key="branch-rashid"
            d={`M ${midG1X} ${branchDropY} H ${rTopX} V ${rTopY}`}
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
        );
      }

      // Branch to Jamshid (m8)
      if (n8) {
        const jTopX = n8.x + n8.width / 2;
        const jTopY = n8.y;
        lines.push(
          <path
            key="branch-jamshid"
            d={`M ${midG1X} ${branchDropY} H ${jTopX} V ${jTopY}`}
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
        );
      }
    }

    // 2. Rashid (m3) & Zarina (m4) marriage link and children
    const n3 = layout['m3'];
    const n4 = layout['m4'];
    if (n3 && n4) {
      const c3X = n3.x + n3.width;
      const c3Y = n3.y + n3.height / 2;
      const c4X = n4.x;
      const c4Y = n4.y + n4.height / 2;
      const midG2X = (c3X + c4X) / 2;
      const midG2Y = c3Y;

      // Horizontal marriage line
      lines.push(
        <line
          key="mar-m3-m4"
          x1={c3X}
          y1={c3Y}
          x2={c4X}
          y2={c4Y}
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );

      // Dropdown to children if not collapsed
      if (!collapsedBranches['m3']) {
        const dropY = midG2Y + 45;
        lines.push(
          <path
            key="drop-g2-rashid"
            d={`M ${midG2X} ${midG2Y} V ${dropY}`}
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
          />
        );

        ['m5', 'm6', 'm7'].forEach((cid) => {
          const cNode = layout[cid];
          if (cNode) {
            const childTopX = cNode.x + cNode.width / 2;
            const childTopY = cNode.y;
            lines.push(
              <path
                key={`branch-child-${cid}`}
                d={`M ${midG2X} ${dropY} H ${childTopX} V ${childTopY}`}
                stroke="#10B981"
                strokeWidth="2"
                fill="none"
              />
            );
          }
        });
      }
    }

    // 3. Jamshid (m8) & Nigora (m9) marriage and children
    const n8 = layout['m8'];
    const n9 = layout['m9'];
    if (n8 && n9) {
      const c8X = n8.x + n8.width;
      const c8Y = n8.y + n8.height / 2;
      const c9X = n9.x;
      const c9Y = n9.y + n9.height / 2;
      const midJ2X = (c8X + c9X) / 2;
      const midJ2Y = c8Y;

      lines.push(
        <line
          key="mar-m8-m9"
          x1={c8X}
          y1={c8Y}
          x2={c9X}
          y2={c9Y}
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );

      if (!collapsedBranches['m8']) {
        const jDropY = midJ2Y + 45;
        lines.push(
          <path
            key="drop-g2-jamshid"
            d={`M ${midJ2X} ${midJ2Y} V ${jDropY}`}
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
          />
        );

        ['m10', 'm11'].forEach((cid) => {
          const cNode = layout[cid];
          if (cNode) {
            const childTopX = cNode.x + cNode.width / 2;
            const childTopY = cNode.y;
            lines.push(
              <path
                key={`branch-jchild-${cid}`}
                d={`M ${midJ2X} ${jDropY} H ${childTopX} V ${childTopY}`}
                stroke="#10B981"
                strokeWidth="2"
                fill="none"
              />
            );
          }
        });
      }
    }

    return lines;
  }, [layout, collapsedBranches]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Top Header Bar matching mockup */}
      <div className="z-20 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 text-slate-300 hover:text-white rounded-full bg-slate-800/80 active:scale-95"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Family Tree</h2>
            <p className="text-[11px] text-emerald-400 font-medium">Interactive Canvas • Karimov Lineage</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeFilter !== 'all'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
              }`}
              aria-label="Filter tree"
            >
              <Filter className="w-4 h-4" />
              <span className="capitalize">{activeFilter}</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 top-11 w-44 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                {(['all', 'direct', 'elders', 'youth'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setActiveFilter(mode);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      activeFilter === mode
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="capitalize">{mode === 'all' ? 'All Generations' : mode}</span>
                    {activeFilter === mode && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all shadow-md shadow-emerald-600/30"
            aria-label="Add Member"
            title="Add relative"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      {treeViewMode === 'tree' && (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#080d1a]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Transformed Tree Root */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="absolute top-0 left-0 w-0 h-0"
          >
            {/* SVG Connecting Lines */}
            <svg
              className="overflow-visible pointer-events-none absolute top-0 left-0"
              style={{ width: 1, height: 1 }}
            >
              {connectionLines}
            </svg>

            {/* Tree Member Cards */}
            {Object.values(layout).map(({ member, x, y, width, height }) => {
              const isSelected = selectedMemberId === member.id;
              const isMe = member.id === 'm3' || member.id === currentUser.familyMemberId;
              const hasChildren = member.childrenIds.length > 0;
              const isCollapsed = collapsedBranches[member.id];

              return (
                <div
                  key={member.id}
                  onClick={() => openMemberProfile(member.id)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    width: `${width}px`,
                  }}
                  className={`tree-card absolute cursor-pointer rounded-2xl p-2.5 flex flex-col items-center text-center transition-all duration-200 group active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-950/90 border-2 border-emerald-400 ring-4 ring-emerald-500/20 shadow-xl shadow-emerald-500/30'
                      : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-emerald-500/60 shadow-lg'
                  }`}
                >
                  {/* Avatar with circle badge */}
                  <div className="relative mb-2">
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className={`w-14 h-14 rounded-full object-cover border-2 shadow-md transition-transform group-hover:scale-105 ${
                        isSelected ? 'border-emerald-400' : 'border-slate-600'
                      }`}
                    />
                    {isMe && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-slate-950 tracking-wider">
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-300">
                    {member.fullName.split(' ')[0]}
                  </h4>

                  {/* Relationship */}
                  <span className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                    {member.relationLabel}
                  </span>

                  {/* Year */}
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ({member.birthYear}–{member.deathYear ? member.deathYear : ''})
                  </span>

                  {/* Collapse / Expand Branch toggle for parents */}
                  {hasChildren && member.gender === 'male' && (
                    <button
                      onClick={(e) => toggleBranch(member.id, e)}
                      className="mt-1.5 p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] flex items-center gap-0.5 shadow-sm active:scale-90"
                      title={isCollapsed ? 'Expand Children' : 'Collapse Children'}
                    >
                      {isCollapsed ? (
                        <>
                          <ChevronDown className="w-3 h-3 text-emerald-400" />
                          <span className="text-[9px] pr-1 font-bold text-emerald-400">
                            +{member.childrenIds.length}
                          </span>
                        </>
                      ) : (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View Mode */}
      {treeViewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950">
          {[1, 2, 3].map((gen) => {
            const genMembers = members.filter((m) => m.generation === gen);
            if (genMembers.length === 0) return null;
            const genTitle =
              gen === 1 ? '1st Generation (Grandparents)' : gen === 2 ? '2nd Generation (Parents & Aunts/Uncles)' : '3rd Generation (Children & Cousins)';

            return (
              <div key={gen} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{genTitle}</h3>
                  <span className="text-[10px] text-slate-500 font-bold font-mono">({genMembers.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {genMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => openMemberProfile(m.id)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <img src={m.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{m.fullName}</h4>
                        <p className="text-xs text-emerald-400 font-medium">{m.relationLabel} • {m.birthYear}</p>
                        <p className="text-[11px] text-slate-400 truncate">{m.birthPlace}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3D / Constellation Graph Orbit Mode */}
      {treeViewMode === 'constellation' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#060a14] relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-emerald-950/30 to-transparent pointer-events-none" />
          {/* Stylized concentric generation rings */}
          <div className="relative w-80 h-80 rounded-full border border-dashed border-emerald-500/20 flex items-center justify-center animate-spin-slow">
            <div className="w-56 h-56 rounded-full border border-dashed border-teal-500/25 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-emerald-500/40 flex items-center justify-center bg-emerald-950/40">
                <span className="text-xs font-bold text-emerald-300">Karimov Ancestry</span>
              </div>
            </div>
          </div>

          <div className="mt-6 z-10 space-y-2">
            <h3 className="text-base font-bold text-white">Constellation Orbit View</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              Every relative orbits the central ancestral core across 3 generations of heritage.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              {members.slice(0, 5).map((m) => (
                <button
                  key={m.id}
                  onClick={() => openMemberProfile(m.id)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400/80 hover:scale-110 transition-transform"
                >
                  <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Canvas Action Controls matching mockup */}
      <div className="tree-control absolute right-4 bottom-20 z-30 flex flex-col items-center gap-2">
        <button
          onClick={handleZoomIn}
          className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Zoom in"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-emerald-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-slate-300" />
        </button>
        <button
          onClick={handleCenter}
          className="w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Center tree"
          title="Center Canvas"
        >
          <Crosshair className="w-5 h-5 text-slate-300" />
        </button>
        <button
          onClick={handleMyPosition}
          className="w-11 h-11 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-xl flex items-center justify-center active:scale-90 transition-transform"
          aria-label="My position"
          title="My Position"
        >
          <User className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Segmented Mode Switcher matching mockup: [ Tree View | List View | 3D View ] */}
      <div className="tree-control absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl">
          <button
            onClick={() => setTreeViewMode('tree')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              treeViewMode === 'tree'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tree View
          </button>
          <button
            onClick={() => setTreeViewMode('list')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              treeViewMode === 'list'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setTreeViewMode('constellation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              treeViewMode === 'constellation'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3D View
          </button>
        </div>
      </div>
    </div>
  );
};
