import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import type { Booking } from '../utils/booking';

export interface RA_DB extends DBSchema {
  rooms: { 
    key: string; 
    value: { id: string; name: string; capacity: number; features: string[] }; 
    indexes: { 'by-name': string }; 
  };
  assets: { 
    key: string; 
    value: { id: string; name: string; inventoryCode: string; status: string }; 
  };
  bookings: { 
    key: string; 
    value: Booking; 
    indexes: { 'by-resource': [string, string] }; 
  };
}

type StoreName = 'rooms' | 'assets' | 'bookings';

export const dbPromise = openDB<RA_DB>('room-assets-db', 1, {
  upgrade(db) {
    const r = db.createObjectStore('rooms', { keyPath: 'id' });
    r.createIndex('by-name', 'name');

    db.createObjectStore('assets', { keyPath: 'id' });

    const b = db.createObjectStore('bookings', { keyPath: 'id' });
    b.createIndex('by-resource', ['resourceType', 'resourceId']);
  }
});

export async function getAll(storeName: 'rooms'): Promise<RA_DB['rooms']['value'][]>;
export async function getAll(storeName: 'assets'): Promise<RA_DB['assets']['value'][]>;
export async function getAll(storeName: 'bookings'): Promise<Booking[]>;
export async function getAll(storeName: StoreName): Promise<any[]> {
  const db = await dbPromise;
  return db.getAll(storeName) as any;
}

export async function put<T extends StoreName>(storeName: T, value: RA_DB[T]['value']) {
  const db = await dbPromise;
  await db.put(storeName, value);
}

export async function bulkClearAndPut(data: {
  rooms?: RA_DB['rooms']['value'][];
  assets?: RA_DB['assets']['value'][];
  bookings?: Booking[];
}) {
  const db = await dbPromise;
  const tx = db.transaction(['rooms','assets','bookings'], 'readwrite');

  if (data.rooms) {
    const store = tx.objectStore('rooms');
    await store.clear();
    for (const r of data.rooms) await store.put(r);
  }

  if (data.assets) {
    const store = tx.objectStore('assets');
    await store.clear();
    for (const a of data.assets) await store.put(a);
  }

  if (data.bookings) {
    const store = tx.objectStore('bookings');
    await store.clear();
    for (const b of data.bookings) await store.put(b);
  }

  await tx.done;
}
