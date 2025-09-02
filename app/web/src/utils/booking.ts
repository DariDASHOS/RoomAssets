// app/web/src/utils/booking.ts
export type Booking = {
  id: string;
  resourceType: 'room' | 'asset';
  resourceId: string;
  title: string;
  start: string;
  end: string;
  notes?: string;
};


export function hasOverlap(candidate: Booking, existingBookings: Booking[]): boolean {
  const cs = Date.parse(candidate.start);
  const ce = Date.parse(candidate.end);
  if (isNaN(cs) || isNaN(ce) || cs >= ce) {
    throw new Error('Invalid candidate dates');
  }

  for (const b of existingBookings) {
    if (b.id === candidate.id) continue;
    const bs = Date.parse(b.start);
    const be = Date.parse(b.end);
    if (isNaN(bs) || isNaN(be)) continue;
    if (cs < be && ce > bs) {
      return true;
    }
  }
  return false;
}
