import { getAll } from '../store/db';

export async function exportAllToJson() {
  const rooms = await getAll('rooms');
  const assets = await getAll('assets');
  const bookings = await getAll('bookings');
  const json = JSON.stringify({ rooms, assets, bookings }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'roomassets-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJsonFile(file: File): Promise<any> {
  const text = await file.text();
  return JSON.parse(text);
}

