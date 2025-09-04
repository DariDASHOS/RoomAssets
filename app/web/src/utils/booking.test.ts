import { describe, it, expect } from 'vitest';
import { hasOverlap } from './booking';
import type { Booking } from './booking';


describe('hasOverlap', () => {
  const existing: Booking[] = [
    { id: '1', resourceType: 'room', resourceId: 'r1', title: 'A', start: '2025-09-05T08:00:00Z', end: '2025-09-05T09:00:00Z' },
  ];

  it('detects overlapping', () => {
    const candidate: Booking = { id: '2', resourceType: 'room', resourceId: 'r1', title: 'B', start: '2025-09-05T08:30:00Z', end: '2025-09-05T09:30:00Z' };
    expect(hasOverlap(candidate, existing)).toBe(true);
  });

  it('allows end == start (no overlap)', () => {
    const candidate: Booking = { id: '2', resourceType: 'room', resourceId: 'r1', title: 'B', start: '2025-09-05T09:00:00Z', end: '2025-09-05T10:00:00Z' };
    expect(hasOverlap(candidate, existing)).toBe(false);
  });
});
