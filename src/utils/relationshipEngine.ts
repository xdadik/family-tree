import { FamilyMember } from '../types/family';

/**
 * Calculates relationship between memberA and memberB (How memberA is related to memberB).
 * e.g. "What is memberA to memberB?" -> If memberA is parent of memberB and male -> "Father"
 */
export function getCalculatedRelationship(
  subject: FamilyMember,
  relativeTo: FamilyMember,
  allMembers: FamilyMember[]
): string {
  if (subject.id === relativeTo.id) {
    return 'Self';
  }

  // Direct Parent
  if (relativeTo.parentIds.includes(subject.id)) {
    return subject.gender === 'male' ? 'Father' : 'Mother';
  }

  // Direct Child
  if (subject.parentIds.includes(relativeTo.id)) {
    return subject.gender === 'male' ? 'Son' : 'Daughter';
  }

  // Spouse
  if (subject.spouseId === relativeTo.id || relativeTo.spouseId === subject.id) {
    return subject.gender === 'male' ? 'Husband' : 'Wife';
  }

  // Siblings (share at least one parent)
  const sharedParents = subject.parentIds.filter((pId) => relativeTo.parentIds.includes(pId));
  if (sharedParents.length > 0) {
    return subject.gender === 'male' ? 'Brother' : 'Sister';
  }

  // Grandparent (subject is parent of one of relativeTo's parents)
  const relativeParents = allMembers.filter((m) => relativeTo.parentIds.includes(m.id));
  const isGrandparent = relativeParents.some((p) => p.parentIds.includes(subject.id));
  if (isGrandparent) {
    return subject.gender === 'male' ? 'Grandfather' : 'Grandmother';
  }

  // Grandchild (relativeTo is parent of one of subject's parents)
  const subjectParents = allMembers.filter((m) => subject.parentIds.includes(m.id));
  const isGrandchild = subjectParents.some((p) => p.parentIds.includes(relativeTo.id));
  if (isGrandchild) {
    return subject.gender === 'male' ? 'Grandson' : 'Granddaughter';
  }

  // Uncle / Aunt (subject is sibling of one of relativeTo's parents)
  for (const parent of relativeParents) {
    const parentSharedWithSubject = subject.parentIds.filter((pid) => parent.parentIds.includes(pid));
    if (parentSharedWithSubject.length > 0) {
      return subject.gender === 'male' ? 'Uncle' : 'Aunt';
    }
  }

  // Nephew / Niece (subject is child of one of relativeTo's siblings)
  const relativeSiblings = allMembers.filter((m) =>
    m.id !== relativeTo.id && m.parentIds.some((pid) => relativeTo.parentIds.includes(pid))
  );
  if (relativeSiblings.some((sib) => subject.parentIds.includes(sib.id))) {
    return subject.gender === 'male' ? 'Nephew' : 'Niece';
  }

  // Cousin (subject's parents and relativeTo's parents are siblings)
  for (const p1 of subjectParents) {
    for (const p2 of relativeParents) {
      if (p1.id !== p2.id && p1.parentIds.some((gpid) => p2.parentIds.includes(gpid))) {
        return 'Cousin';
      }
    }
  }

  // Fallback to designated label or generation logic
  if (subject.generation < relativeTo.generation) {
    return subject.gender === 'male' ? 'Elder / Ancestor' : 'Elder / Ancestress';
  } else if (subject.generation > relativeTo.generation) {
    return 'Descendant';
  }

  return subject.relationLabel || 'Relative';
}
