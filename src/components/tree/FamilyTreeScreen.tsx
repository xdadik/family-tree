import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  User,
  Filter,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  RotateCw,
  Eye,
  Shield,
  Layers,
  ArrowRight,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, TreeViewMode } from '../../types/family';

interface MemberNodeLayout {
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
    setSelectedMemberId,
    openMemberProfile,
    currentUser,
    isAdmin,
    treeViewMode,
    setTreeViewMode,
    setIsAddMemberOpen,
    setEditingMember,
    openAddMemberWithRelation,
    clearAllMembers,
    theme,
    setTheme,
    canvasBg,
    setCanvasBg,
    setIsLoginModalOpen,
    t,
  } = useFamily();

  // Canvas pan and zoom state
  const [zoom, setZoom] = useState(0.95);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filters & branch state
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'elders' | 'youth'>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isPaletteMenuOpen, setIsPaletteMenuOpen] = useState(false);
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});

  // Active selected member in 3D or 2D
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);

  // 3D Canvas state
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const rot3DRef = useRef({ x: 0.25, y: 0.1, zoom: 1 });
  const is3DDraggingRef = useRef(false);
  const last3DPosRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  autoRotateRef.current = autoRotate;

  // Cached avatar images for 3D canvas
  const avatarImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Center tree on initial mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setPan({ x: clientWidth / 2, y: 70 });
      setZoom(0.92);
    }
  }, []);

  // Pre-load avatar images for 3D Canvas
  useEffect(() => {
    members.forEach((m) => {
      if (!avatarImagesRef.current[m.id] && m.avatarUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = m.avatarUrl;
        img.onload = () => {
          avatarImagesRef.current[m.id] = img;
        };
      }
    });
  }, [members]);

  // Filter members — meaningful mobile filters
  const filteredMembers = useMemo(() => {
    if (activeFilter === 'elders') {
      return members.filter((m) => (m.generation || 1) <= 2);
    }
    if (activeFilter === 'direct') {
      // Founders + anyone with children (direct lineage), exclude leaf spouses without children
      return members.filter(
        (m) => (m.parentIds || []).length === 0 || (m.childrenIds && m.childrenIds.length > 0),
      );
    }
    if (activeFilter === 'youth') {
      const maxGen = Math.max(1, ...members.map((m) => m.generation || 1));
      return members.filter((m) => (m.generation || 1) >= Math.max(3, maxGen - 1));
    }
    return members;
  }, [members, activeFilter]);

  // Living-tree layout: couples paired, siblings kept adjacent so limbs don't cross,
  // families ordered by descent so each branch grows under its parents.
  const layout = useMemo(() => {
    const CARD_W = 126;
    const CARD_H = 150;
    const GEN_Y_GAP = 172;
    const SIBLING_GAP = 30;
    const COUPLE_GAP = 14;

    const nodePositions: Record<string, MemberNodeLayout> = {};
    if (filteredMembers.length === 0) return nodePositions;

    const byId = new Map(filteredMembers.map((m) => [m.id, m]));

    // Descent key: walk up to the eldest ancestor in the filtered set.
    // Siblings share the key → they sit together; branches stay under parents.
    const descentKey = (m: FamilyMember): string => {
      const seen = new Set<string>();
      let cur: FamilyMember | undefined = m;
      let key = m.id;
      while (cur && !seen.has(cur.id)) {
        seen.add(cur.id);
        key = cur.id;
        const nextParent: FamilyMember | undefined = (cur.parentIds || [])
          .map((pid: string) => byId.get(pid))
          .find((p: FamilyMember | undefined) => p);
        cur = nextParent;
      }
      return key;
    };

    // Group members by generation
    const generations: Record<number, FamilyMember[]> = {};
    filteredMembers.forEach((m) => {
      const gen = m.generation || 1;
      if (!generations[gen]) generations[gen] = [];
      generations[gen].push(m);
    });

    const sortedGenKeys = Object.keys(generations)
      .map(Number)
      .sort((a, b) => a - b);

    sortedGenKeys.forEach((genKey, genIdx) => {
      const genMembers = generations[genKey];
      const gY = 40 + genIdx * GEN_Y_GAP;

      // Group into family units: couples paired together, singles
      const processed = new Set<string>();
      const units: FamilyMember[][] = [];

      genMembers.forEach((m) => {
        if (processed.has(m.id)) return;
        if (m.spouseId) {
          const spouse = genMembers.find((s) => s.id === m.spouseId);
          if (spouse && !processed.has(spouse.id)) {
            // Put male on left if applicable
            if (m.gender === 'female' && spouse.gender === 'male') {
              units.push([spouse, m]);
            } else {
              units.push([m, spouse]);
            }
            processed.add(m.id);
            processed.add(spouse.id);
            return;
          }
        }
        units.push([m]);
        processed.add(m.id);
      });

      // Order units by descent so each family's limbs grow together, then by birth year.
      const unitKey = (unit: FamilyMember[]): string => {
        const keys = unit.map((m) => descentKey(m)).sort();
        const years = unit.map((m) => m.birthYear || 9999);
        return `${keys[0]}|${Math.min(...years)}|${unit[0].id}`;
      };
      units.sort((a, b) => (unitKey(a) < unitKey(b) ? -1 : unitKey(a) > unitKey(b) ? 1 : 0));

      // Calculate total width of this generation row
      let totalRowWidth = 0;
      units.forEach((unit, uIdx) => {
        if (unit.length === 2) {
          totalRowWidth += CARD_W * 2 + COUPLE_GAP;
        } else {
          totalRowWidth += CARD_W;
        }
        if (uIdx < units.length - 1) {
          totalRowWidth += SIBLING_GAP;
        }
      });

      let currentX = -totalRowWidth / 2;

      units.forEach((unit, uIdx) => {
        if (unit.length === 2) {
          nodePositions[unit[0].id] = {
            member: unit[0],
            x: currentX,
            y: gY,
            width: CARD_W,
            height: CARD_H,
          };
          currentX += CARD_W + COUPLE_GAP;
          nodePositions[unit[1].id] = {
            member: unit[1],
            x: currentX,
            y: gY,
            width: CARD_W,
            height: CARD_H,
          };
          currentX += CARD_W;
        } else {
          nodePositions[unit[0].id] = {
            member: unit[0],
            x: currentX,
            y: gY,
            width: CARD_W,
            height: CARD_H,
          };
          currentX += CARD_W;
        }
        if (uIdx < units.length - 1) {
          currentX += SIBLING_GAP;
        }
      });
    });

    return nodePositions;
  }, [filteredMembers]);

  // Touch and Mouse handlers for 2D Canvas
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

  // Touch gestures for mobile/Android
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
      setIsDragging(false);
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
      setZoom((z) => Math.min(Math.max(z * (ratio > 1 ? 1.02 : 0.98), 0.4), 2.5));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  // Native non-passive wheel listener: React attaches wheel as passive,
  // so preventDefault inside onWheel is ignored and zoom stutters.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
      setZoom((z) => Math.min(Math.max(z + zoomDelta, 0.4), 2.5));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [treeViewMode]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.4));

  const handleCenter = () => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setPan({ x: clientWidth / 2, y: 70 });
      setZoom(0.92);
    }
  };

  const handleMyPosition = () => {
    const myId = currentUser?.familyMemberId;
    const targetNode =
      (myId && layout[myId]) || (focusedMemberId && layout[focusedMemberId]) || Object.values(layout)[0];
    if (targetNode && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPan({
        x: clientWidth / 2 - targetNode.x - targetNode.width / 2,
        y: clientHeight / 2 - targetNode.y - targetNode.height / 2,
      });
      setZoom(1.05);
      if (targetNode.member) setFocusedMemberId(targetNode.member.id);
    }
  };

  const toggleBranch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedBranches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pedigree rendering in the FamilySearch/Ancestry tradition:
  // quiet hairlines, rounded couple brackets, one bus line per sibling group.
  // No illustration — restraint is the design.
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const treeDecor = useMemo(() => {
    const isDark = theme === 'dark';
    const hairline = isDark ? '#8a715a' : '#b49b78';
    const coupleInk = isDark ? '#c9b18c' : '#7c5f3d';
    const lines: React.ReactNode[] = [];
    const back: React.ReactNode[] = [];

    // Track drawn marriages to avoid double drawing
    const drawnSpouses = new Set<string>();

    filteredMembers.forEach((member) => {
      const parentNode = layout[member.id];
      if (!parentNode) return;

      // 1. Couple link: a single quiet line between spouses
      if (member.spouseId && layout[member.spouseId]) {
        const pairKey = [member.id, member.spouseId].sort().join('-');
        if (!drawnSpouses.has(pairKey)) {
          drawnSpouses.add(pairKey);
          const spouseNode = layout[member.spouseId];
          const leftNode = parentNode.x < spouseNode.x ? parentNode : spouseNode;
          const rightNode = parentNode.x < spouseNode.x ? spouseNode : parentNode;

          const x1 = leftNode.x + leftNode.width;
          const yMid = leftNode.y + leftNode.height / 2;
          const x2 = rightNode.x;

          lines.push(
            <line
              key={`spouse-${pairKey}`}
              x1={x1}
              y1={yMid}
              x2={x2}
              y2={yMid}
              stroke={coupleInk}
              strokeWidth="1.5"
            />,
          );
        }
      }

      // 2. Parents → children: drop from the couple midpoint, one rounded bus,
      //    short drops into each child. Draw once per family unit.
      const hasChildren = member.childrenIds && member.childrenIds.length > 0;
      const isBranchOwner =
        hasChildren &&
        !collapsedBranches[member.id] &&
        (() => {
          if (member.spouseId && layout[member.spouseId]) {
            const spouse = filteredMembers.find((s) => s.id === member.spouseId);
            if (spouse?.childrenIds?.some((cid) => member.childrenIds.includes(cid))) {
              // Draw from male partner if present, else from lexicographically smaller id for stability
              if (member.gender === 'female' && spouse.gender === 'male') return false;
              if (member.gender === spouse.gender) return member.id < spouse.id;
              return true;
            }
          }
          // Single parent (e.g. single mother) always draws its own branch
          return true;
        })();
      if (isBranchOwner && hasChildren) {
        let pMidX = parentNode.x + parentNode.width / 2;
        const pBottomY = parentNode.y + parentNode.height;

        // If spouse exists, start from the midpoint between the couple
        if (member.spouseId && layout[member.spouseId]) {
          const spouseNode = layout[member.spouseId];
          pMidX = (parentNode.x + spouseNode.x + parentNode.width) / 2;
        }

        const visibleChildren = member.childrenIds
          .map((cid) => layout[cid])
          .filter((n) => n)
          .map((n) => ({ x: n.x + n.width / 2, y: n.y }));
        if (visibleChildren.length === 0) return;

        if (visibleChildren.length === 1) {
          // Single child: one straight quiet line
          const c = visibleChildren[0];
          lines.push(
            <line
              key={`stem-${member.id}`}
              x1={pMidX}
              y1={pBottomY}
              x2={c.x}
              y2={c.y}
              stroke={hairline}
              strokeWidth="1.5"
            />,
          );
          return;
        }

        const firstX = Math.min(...visibleChildren.map((c) => c.x));
        const lastX = Math.max(...visibleChildren.map((c) => c.x));
        const childTopY = Math.min(...visibleChildren.map((c) => c.y));
        const busY = pBottomY + (childTopY - pBottomY) * 0.42;

        // Drop from parents to the bus
        lines.push(
          <line key={`drop-${member.id}`} x1={pMidX} y1={pBottomY} x2={pMidX} y2={busY} stroke={hairline} strokeWidth="1.5" />,
        );
        // The bus with rounded ends
        lines.push(
          <path
            key={`bus-${member.id}`}
            d={`M ${firstX} ${busY} H ${lastX}`}
            stroke={hairline}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />,
        );
        // Rounded drops into each child
        visibleChildren.forEach((c, i) => {
          lines.push(
            <line
              key={`drop-child-${member.id}-${i}`}
              x1={c.x}
              y1={busY}
              x2={c.x}
              y2={c.y}
              stroke={hairline}
              strokeWidth="1.5"
            />,
          );
          // Joint dot where drop meets the bus (except straight-through middle child)
          if (c.x !== pMidX) {
            lines.push(<circle key={`joint-${member.id}-${i}`} cx={c.x} cy={busY} r="2" fill={hairline} />);
          }
        });
        // Round the bus corners where the parent drop lands
        lines.push(<circle key={`joint-p-${member.id}`} cx={pMidX} cy={busY} r="2" fill={hairline} />);
      }
    });

    return { back, lines };
  }, [layout, filteredMembers, collapsedBranches, theme]);

  // Roman generation markers riding the left edge of each row
  const generationMarkers = useMemo(() => {
    const byGen: Record<number, { x: number; y: number; count: number }> = {};
    Object.values(layout).forEach(({ member, x, y }) => {
      const gen = member.generation || 1;
      if (!byGen[gen]) byGen[gen] = { x, y, count: 0 };
      byGen[gen].x = Math.min(byGen[gen].x, x);
      byGen[gen].count += 1;
    });
    return Object.entries(byGen)
      .map(([gen, v]) => ({ gen: Number(gen), ...v }))
      .sort((a, b) => a.gen - b.gen);
  }, [layout]);

  // -------------------------------------------------------------
  // HIGH-PERFORMANCE 3D CONSTELLATION ORBIT CANVAS
  // (Uses ref for angles so requestAnimationFrame doesn't re-render React)
  // -------------------------------------------------------------
  useEffect(() => {
    if (treeViewMode !== 'orbit3d') return;
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let visible = true;
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) animId = requestAnimationFrame(render3D);
      else cancelAnimationFrame(animId);
    };
    document.addEventListener('visibilitychange', onVisibility);

    const render3D = () => {
      if (!visible) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.parentElement?.clientWidth || 360;
      const cssH = canvas.parentElement?.clientHeight || 500;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = cssW;
      const height = cssH;

      const isDark = theme === 'dark';
      const bgFill =
        canvasBg === 'slate' || canvasBg === 'black'
          ? '#1c1917'
          : canvasBg === 'cream' || canvasBg === 'white'
          ? '#faf6ee'
          : isDark
          ? '#1c1917'
          : '#faf6ee';
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 380;

      // Auto rotation update via ref without React re-renders!
      if (autoRotateRef.current && !is3DDraggingRef.current) {
        rot3DRef.current.y += 0.0035;
      }

      const { x: rotX, y: rotY, zoom: zoom3D } = rot3DRef.current;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const count = members.length;
      const radiusBase = Math.min(width, height) * 0.38 * zoom3D;

      // Calculate 3D node positions
      const nodes3D = members.map((m, idx) => {
        const angle = (idx / Math.max(count, 1)) * Math.PI * 2;
        const genOffset = ((m.generation || 1) - 2) * 85 * zoom3D;

        const bx = Math.sin(angle) * radiusBase;
        const by = genOffset;
        const bz = Math.cos(angle) * radiusBase;

        // Rotate Y
        const x1 = bx * cosY - bz * sinY;
        const z1 = bx * sinY + bz * cosY;

        // Rotate X
        const y2 = by * cosX - z1 * sinX;
        const z2 = by * sinX + z1 * cosX;

        // Perspective projection
        const scale = fov / (fov + z2 + 300);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return {
          member: m,
          px,
          py,
          scale,
          z: z2,
        };
      });

      // Sort by depth
      nodes3D.sort((a, b) => b.z - a.z);

      // 1. Orbital tier rings
      [-85, 0, 85].forEach((levelY) => {
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const rx = Math.sin(a) * radiusBase;
          const rz = Math.cos(a) * radiusBase;

          const x1 = rx * cosY - rz * sinY;
          const z1 = rx * sinY + rz * cosY;
          const y2 = levelY * zoom3D * cosX - z1 * sinX;
          const z2 = levelY * zoom3D * sinX + z1 * cosX;

          const s = fov / (fov + z2 + 300);
          const px = cx + x1 * s;
          const py = cy + y2 * s;

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 2. 3D Relationship Connection Lines
      nodes3D.forEach((node) => {
        if (node.member.childrenIds) {
          node.member.childrenIds.forEach((cid) => {
            const childNode = nodes3D.find((n) => n.member.id === cid);
            if (childNode) {
              ctx.beginPath();
              ctx.moveTo(node.px, node.py);
              ctx.lineTo(childNode.px, childNode.py);
              ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)';
              ctx.lineWidth = Math.max(1.2 * node.scale, 0.8);
              ctx.stroke();
            }
          });
        }
      });

      // 3. 3D Spheres with Profile Avatars and Labels
      nodes3D.forEach((node) => {
        const radius = Math.max(16 * node.scale, 9);
        const isFocused = focusedMemberId === node.member.id;

        // Glowing outer ring for focused node
        if (isFocused) {
          ctx.beginPath();
          ctx.arc(node.px, node.py, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? '#ffffff' : '#09090b';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Outer rim
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius + 2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#18181b' : '#ffffff';
        ctx.fill();
        ctx.strokeStyle = isDark ? '#3f3f46' : '#d4d4d8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw avatar image or initial
        const cachedImg = avatarImagesRef.current[node.member.id];
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.clip();

        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          ctx.drawImage(cachedImg, node.px - radius, node.py - radius, radius * 2, radius * 2);
        } else {
          ctx.fillStyle = isDark ? '#27272a' : '#e4e4e7';
          ctx.fill();
          ctx.font = `bold ${Math.max(10 * node.scale, 7)}px sans-serif`;
          ctx.fillStyle = isDark ? '#ffffff' : '#09090b';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.member.fullName.charAt(0) || 'S', node.px, node.py);
        }
        ctx.restore();

        // Name text badge
        ctx.font = `bold ${Math.max(11 * node.scale, 8)}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = isDark ? '#ffffff' : '#09090b';
        ctx.textAlign = 'center';
        ctx.fillText(node.member.fullName.split(' ')[0], node.px, node.py + radius + 13 * node.scale);

        // Relation badge
        ctx.font = `${Math.max(9 * node.scale, 7)}px sans-serif`;
        ctx.fillStyle = isDark ? '#a1a1aa' : '#71717a';
        ctx.fillText(node.member.relationLabel, node.px, node.py + radius + 24 * node.scale);
      });

      animId = requestAnimationFrame(render3D);
    };

    animId = requestAnimationFrame(render3D);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [treeViewMode, members, theme, canvasBg, focusedMemberId]);

  // Touch and Drag handlers for 3D Orbit
  const dragDistanceRef = useRef(0);
  const handle3DPointerDown = (clientX: number, clientY: number) => {
    is3DDraggingRef.current = true;
    dragDistanceRef.current = 0;
    last3DPosRef.current = { x: clientX, y: clientY };
  };

  const handle3DPointerMove = (clientX: number, clientY: number) => {
    if (!is3DDraggingRef.current) return;
    const deltaX = clientX - last3DPosRef.current.x;
    const deltaY = clientY - last3DPosRef.current.y;
    dragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

    rot3DRef.current.y += deltaX * 0.008;
    rot3DRef.current.x = Math.max(Math.min(rot3DRef.current.x + deltaY * 0.008, 1.3), -1.3);

    last3DPosRef.current = { x: clientX, y: clientY };
  };

  const handle3DPointerUp = (clientX: number, clientY: number) => {
    const wasDrag = dragDistanceRef.current > 8;
    is3DDraggingRef.current = false;
    if (wasDrag) return; // it was a drag, not a tap
    // Tap to select a 3D node
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const fov = 380;
    const { x: rotX, y: rotY, zoom: zoom3D } = rot3DRef.current;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const count = members.length;
    const radiusBase = Math.min(width, height) * 0.38 * zoom3D;

    // Find clicked node in 3D
    let clickedMember: FamilyMember | null = null;
    let minDistance = 30; // hit threshold

    members.forEach((m, idx) => {
      const angle = (idx / Math.max(count, 1)) * Math.PI * 2;
      const genOffset = ((m.generation || 1) - 2) * 85 * zoom3D;
      const bx = Math.sin(angle) * radiusBase;
      const by = genOffset;
      const bz = Math.cos(angle) * radiusBase;

      const x1 = bx * cosY - bz * sinY;
      const z1 = bx * sinY + bz * cosY;
      const y2 = by * cosX - z1 * sinX;
      const z2 = by * sinX + z1 * cosX;

      const scale = fov / (fov + z2 + 300);
      const px = cx + x1 * scale;
      const py = cy + y2 * scale;

      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < minDistance) {
        minDistance = dist;
        clickedMember = m;
      }
    });

    if (clickedMember) {
      setFocusedMemberId((clickedMember as FamilyMember).id);
    }
  };

  const handle3DZoomIn = () => {
    rot3DRef.current.zoom = Math.min(rot3DRef.current.zoom + 0.15, 2.0);
  };

  const handle3DZoomOut = () => {
    rot3DRef.current.zoom = Math.max(rot3DRef.current.zoom - 0.15, 0.5);
  };

  const focusedMember = members.find((m) => m.id === focusedMemberId);

  return (
    <div className="relative flex-1 w-full h-full flex flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-950 transition-colors select-none">
      {/* Top Floating Control Bar */}
      <div className="tree-control absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Filter Dropdown */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-md hover:border-black dark:hover:border-white transition-all active:scale-95"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="capitalize">
              {activeFilter === 'all' && t.allGenerations}
              {activeFilter === 'direct' && t.directLine}
              {activeFilter === 'elders' && t.elders}
              {activeFilter === 'youth' && t.youth}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {isFilterMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-1.5 shadow-xl z-50 space-y-1">
              {[
                { id: 'all', label: t.allGenerations },
                { id: 'direct', label: t.directLine },
                { id: 'elders', label: t.elders },
                { id: 'youth', label: t.youth },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveFilter(f.id as any);
                    setIsFilterMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    activeFilter === f.id
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{f.label}</span>
                  {activeFilter === f.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Quick Add Member & Theme Switcher (2 high-contrast human themes) */}
        <div className="pointer-events-auto flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setIsPaletteMenuOpen(!isPaletteMenuOpen)}
              className="min-w-[44px] min-h-[44px] p-2 rounded-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              title={t.theme}
              aria-label={t.theme}
            >
              <Palette className="w-4 h-4" />
              <span
                style={{
                  backgroundColor: canvasBg === 'white' || canvasBg === 'cream' ? '#faf6ee' : '#1c1917',
                  borderColor: '#9a3412',
                }}
                className="w-3 h-3 rounded-full border-2 shadow-inner inline-block"
              />
            </button>

            {isPaletteMenuOpen && (
              <div className="absolute right-0 top-12 z-30 p-2 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center gap-2 animate-fade-in">
                {[
                  { id: 'white', title: 'Qog‘oz — yorug‘ (kontrast 12:1)', dot: '#faf6ee', border: '#9a3412', check: '#1c1917' },
                  { id: 'black', title: 'Tun — qorong‘u (kontrast 13:1)', dot: '#1c1917', border: '#e8b26a', check: '#faf6ee' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCanvasBg(p.id as any);
                      setIsPaletteMenuOpen(false);
                    }}
                    title={p.title}
                    aria-label={p.title}
                    aria-pressed={canvasBg === p.id || (p.id === 'white' && canvasBg === 'cream') || (p.id === 'black' && canvasBg === 'slate')}
                    className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 ${
                      canvasBg === p.id || (p.id === 'white' && canvasBg === 'cream') || (p.id === 'black' && canvasBg === 'slate')
                        ? 'ring-2 ring-[#9a3412] scale-110 z-10'
                        : 'hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: p.dot, borderColor: p.border }}
                  >
                    {(canvasBg === p.id || (p.id === 'white' && canvasBg === 'cream') || (p.id === 'black' && canvasBg === 'slate')) && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: p.check }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingMember(null);
                setIsAddMemberOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addMember}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2D INTERACTIVE FAMILY TREE CANVAS */}
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
            backgroundColor:
              canvasBg === 'slate' || canvasBg === 'black'
                ? '#1c1917'
                : canvasBg === 'cream' || canvasBg === 'white'
                ? '#faf6ee'
                : theme === 'dark'
                ? '#1c1917'
                : '#faf6ee',
          }}
          className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing transition-colors"
        >
          {filteredMembers.length === 0 ? (
            /* Empty state when all members are deleted or filtered */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
              <div className="w-16 h-16 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 shadow-sm">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {t.noMembersYet}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {t.noMembersDesc}
                </p>
              </div>
              {isAdmin ? (
                <button
                  onClick={() => {
                    setEditingMember(null);
                    setIsAddMemberOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addFirstMember}</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t.login} (Admin)</span>
                </button>
              )}
            </div>
          ) : (
            /* Transformed Tree Root */
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              className="absolute top-0 left-0 w-0 h-0"
            >
              {/* Trunk, rings, limbs, twigs */}
              <svg
                className="overflow-visible pointer-events-none absolute top-0 left-0"
                style={{ width: 1, height: 1 }}
              >
                {treeDecor.back}
                {treeDecor.lines}
              </svg>

              {/* Roman generation markers */}
              {generationMarkers.map((g) => (
                <div
                  key={g.gen}
                  style={{ transform: `translate(${g.x - 64}px, ${g.y + 44}px)` }}
                  className="absolute pointer-events-none select-none text-center"
                >
                  <div className="font-display text-lg leading-none text-[#b45309] dark:text-[#e8b26a] opacity-90">
                    {ROMAN[g.gen - 1] || g.gen}
                  </div>
                  <div className="font-mono2 text-[9px] text-neutral-500 dark:text-neutral-400">
                    {g.count}
                  </div>
                </div>
              ))}

              {/* Tree Member Cards — portrait pedigree tiles */}
              {Object.values(layout).map(({ member, x, y, width }) => {
                const isSelected = selectedMemberId === member.id || focusedMemberId === member.id;
                const isMe = !!currentUser?.familyMemberId && member.id === currentUser.familyMemberId;
                const hasChildren = !!member.childrenIds && member.childrenIds.length > 0;
                const isCollapsed = collapsedBranches[member.id];
                const by = member.birthYear && member.birthYear > 0 ? member.birthYear : 0;
                const dy = member.deathYear && member.deathYear > 0 ? member.deathYear : 0;
                const lifespan = !by ? '—' : member.isLiving ? `${by} –` : dy ? `${by} – ${dy}` : `${by} – ?`;
                const passed = !member.isLiving;

                return (
                  <div
                    key={member.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${member.fullName}, ${member.relationLabel}`}
                    onClick={() => {
                      setFocusedMemberId(member.id);
                      setSelectedMemberId(member.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFocusedMemberId(member.id);
                        setSelectedMemberId(member.id);
                      }
                    }}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      width: `${width}px`,
                    }}
                    className={`tree-card absolute rounded-xl px-2 pt-2.5 pb-2 flex flex-col items-center text-center transition-all duration-150 group active:scale-[0.98] cursor-pointer ${
                      isSelected
                        ? 'bg-[#fffdf7] dark:bg-[#262019] border-[1.5px] border-[#b45309] ring-4 ring-[#b45309]/20 z-20 shadow-[0_18px_36px_-18px_rgba(60,40,20,0.55)]'
                        : 'bg-[#fffdf7] dark:bg-[#262019] hover:border-[#b45309]/70 border border-[#ddd2bd] dark:border-[#453a2c] z-10 shadow-[0_10px_24px_-18px_rgba(60,40,20,0.45)]'
                    } ${passed ? 'opacity-[0.88]' : ''}`}
                  >
                    {/* Relation micro-label */}
                    <div className="font-mono2 text-[8px] uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400 truncate max-w-full">
                      {member.relationLabel}
                    </div>

                    {/* Portrait */}
                    <div className="relative my-1.5">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.fullName}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          className="w-[52px] h-[52px] rounded-full object-cover border border-[#d8c49a] dark:border-[#5a4a33] shadow-sm transition-transform"
                        />
                      ) : null}
                      <div
                        aria-hidden={!!member.avatarUrl}
                        style={member.avatarUrl ? { position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' } : undefined}
                        className={`w-[52px] h-[52px] rounded-full flex items-center justify-center font-display text-xl shadow-sm transition-transform border bg-[#f3e8cf] text-[#7c4a21] dark:bg-[#3a2f22] dark:text-[#e8c88a] border-[#d8c49a] dark:border-[#5a4a33] ${
                          member.avatarUrl ? '' : 'relative'
                        }`}
                      >
                        {(member.fullName || '?').charAt(0).toUpperCase()}
                      </div>
                      {isMe && (
                        <span className="absolute -bottom-1 -right-2 px-1.5 py-px rounded-full font-mono2 text-[8px] font-bold bg-[#1c1917] text-[#faf6ee] dark:bg-[#e8c88a] dark:text-[#1c1917] tracking-wider">
                          {t.you}
                        </span>
                      )}
                    </div>

                    {/* Name + life span — the pedigree convention */}
                    <h4 className="font-display text-[13px] leading-tight text-neutral-900 dark:text-[#faf6ee] line-clamp-2 w-full min-h-[2em]">
                      {member.fullName}
                    </h4>
                    <div className="font-mono2 text-[10px] text-neutral-600 dark:text-neutral-300 mt-0.5">
                      {lifespan}
                    </div>

                    {/* Quiet actions */}
                    <div className="mt-1 w-full flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMemberProfile(member.id);
                        }}
                        className="min-h-[28px] px-1 font-mono2 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-[#9a3412] dark:hover:text-[#e8c88a] transition-colors"
                      >
                        {t.profile} →
                      </button>

                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddMemberWithRelation(member, 'child');
                          }}
                          className="min-h-[28px] min-w-[28px] px-1.5 rounded-full border border-[#ddd2bd] dark:border-[#453a2c] text-neutral-500 dark:text-neutral-400 hover:text-[#9a3412] hover:border-[#9a3412] dark:hover:text-[#e8c88a] dark:hover:border-[#e8c88a] text-[13px] font-bold transition-all active:scale-95"
                          title={t.addChild}
                          aria-label={`${t.addChild} — ${member.fullName}`}
                        >
                          +
                        </button>
                      )}
                    </div>

                    {/* Branch Collapse/Expand for any parent */}
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleBranch(member.id, e)}
                        className="mt-0.5 min-h-[32px] px-2 rounded-full text-neutral-400 dark:text-neutral-500 hover:text-[#9a3412] dark:hover:text-[#e8c88a] font-mono2 text-[9px] font-bold flex items-center gap-0.5 active:scale-90 transition-all"
                        title={isCollapsed ? 'Expand Children' : 'Collapse Children'}
                      >
                        {isCollapsed ? (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            <span className="text-[9px] pr-1 font-bold">+{member.childrenIds.length}</span>
                          </>
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Generations List View */}
      {treeViewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-50 dark:bg-neutral-950 transition-colors">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((gen) => {
            const genMembers = members.filter((m) => (m.generation || 1) === gen);
            if (genMembers.length === 0) return null;

            return (
              <div key={gen} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-white" />
                  <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {gen} - {t.generations}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">({genMembers.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {genMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => openMemberProfile(m.id)}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-500 cursor-pointer active:scale-[0.99] transition-all shadow-sm text-left min-h-[56px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {m.avatarUrl ? (
                          <img
                            src={m.avatarUrl}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            className="w-11 h-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center flex-shrink-0">
                            {(m.fullName || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{m.fullName}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
                            {m.relationLabel} <span aria-hidden="true">·</span> {m.birthYear && m.birthYear > 0 ? m.birthYear : '19..'}
                          </p>
                          {m.birthPlace ? (
                            <p className="text-[11px] text-neutral-400 truncate">{m.birthPlace}</p>
                          ) : null}
                        </div>
                      </div>

                      <span className="px-2.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white flex-shrink-0">
                        {t.profile}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REAL INTERACTIVE 3D ORBIT VIEW */}
      {treeViewMode === 'orbit3d' && (
        <div
          onMouseDown={(e) => handle3DPointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handle3DPointerMove(e.clientX, e.clientY)}
          onMouseUp={(e) => handle3DPointerUp(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches[0]) handle3DPointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handle3DPointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={(e) => {
            if (e.changedTouches[0]) handle3DPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }}
          style={{ touchAction: 'none' }}
          className="relative flex-1 w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-colors"
        >
          <canvas ref={canvas3DRef} className="w-full h-full pointer-events-auto" />

          {/* 3D Orbit Helper overlay */}
          <div className="absolute top-16 left-4 z-20 pointer-events-none space-y-0.5">
            <span className="text-xs font-bold text-neutral-900 dark:text-white block">
              {t.orbit3DView}
            </span>
            <p className="text-[11px] text-neutral-500">{t.rotate3DHint}</p>
          </div>

          {/* 3D Top Controls */}
          <div className="absolute top-16 right-4 z-20 flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                autoRotate
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? t.autoRotate : t.manualRotate}</span>
            </button>
          </div>

          {/* 3D Zoom Controls */}
          <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-2">
            <button
              onClick={handle3DZoomIn}
              className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center active:scale-95"
              title={t.zoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handle3DZoomOut}
              className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-center active:scale-95"
              title={t.zoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Focused 3D Member Card Popup */}
          {focusedMember && (
            <div className="absolute bottom-20 left-4 right-4 z-30 max-w-sm mx-auto p-3.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center justify-between animate-slide-up">
              <div
                onClick={() => openMemberProfile(focusedMember.id)}
                className="flex items-center gap-3 cursor-pointer min-w-0"
              >
                <img
                  src={focusedMember.avatarUrl}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {focusedMember.fullName}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {focusedMember.relationLabel} · {focusedMember.birthYear}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openMemberProfile(focusedMember.id)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold active:scale-95"
                >
                  {t.viewProfile}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Canvas Controls for 2D (Tactile Monochrome Buttons) */}
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

      {/* Segmented Mode Switcher (Tree / List — human, no gimmick) */}
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
