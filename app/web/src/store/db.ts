import { openDB } from 'idb';
import type { Booking } from '../utils/booking';

const DB_NAME = 'room-assets-db';
const DB_VERSION = 1;

export async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('rooms')) {
        db.createObjectStore('rooms', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id' });
      }
    },
  });
}

export async function bulkClearAndPut(seed: {
  rooms: any[];
  assets: any[];
  bookings: Booking[];
}) {
  const db = await getDb();

  const tx = db.transaction(['rooms', 'assets', 'bookings'], 'readwrite');
  await Promise.all([
    tx.objectStore('rooms').clear(),
    tx.objectStore('assets').clear(),
    tx.objectStore('bookings').clear(),
  ]);

  seed.rooms.forEach((r) => tx.objectStore('rooms').put(r));
  seed.assets.forEach((a) => tx.objectStore('assets').put(a));
  seed.bookings.forEach((b) => tx.objectStore('bookings').put(b));

  await tx.done;
}

export async function listBookings(): Promise<Booking[]> {
  const db = await getDb();
  return await db.getAll('bookings');
}

export async function createBooking(newBooking: Booking): Promise<void> {
  const db = await getDb();

  const existing = await db.getAll('bookings');
  const overlap = existing.find(
    (b) =>
      b.resourceType === newBooking.resourceType &&
      b.resourceId === newBooking.resourceId &&
      !(newBooking.end <= b.start || newBooking.start >= b.end)
  );

  if (overlap) {
    throw new Error('Пересечение с другой бронью!');
  }

  await db.put('bookings', newBooking);
}

export async function listRooms() {
  const db = await getDb();
  return await db.getAll('rooms');
}

export async function listAssets() {
  const db = await getDb();
  return await db.getAll('assets');
}

export async function updateBooking(updated: Booking) {
  const db = await getDb();
  await db.put('bookings', updated);
}

export async function deleteBooking(id: string) {
  const db = await getDb();
  await db.delete('bookings', id);
}

export async function exportAll() {
  const db = await getDb();
  const rooms = await db.getAll('rooms');
  const assets = await db.getAll('assets');
  const bookings = await db.getAll('bookings');
  return { rooms, assets, bookings };
}

export async function importAll(data: any) {
  await bulkClearAndPut(data);
}