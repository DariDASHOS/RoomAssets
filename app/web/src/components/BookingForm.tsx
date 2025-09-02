import { useState } from 'preact/hooks';
import type { Booking } from '../utils/booking';
import { hasOverlap } from '../utils/booking';
import { dbPromise } from '../store/db';
import { localDatetimeToUtcIso } from '../utils/time';

export default function BookingForm({ booking, onSave }: { booking?: Booking, onSave: ()=>void }) {
  const [resourceId, setResourceId] = useState(booking?.resourceId || '');
  const [resourceType, setResourceType] = useState<'room'|'asset'>(booking?.resourceType || 'room');
  const [title, setTitle] = useState(booking?.title || '');
  const [start, setStart] = useState(booking ? booking.start.slice(0,16) : '');
  const [end, setEnd] = useState(booking ? booking.end.slice(0,16) : '');
  const [notes, setNotes] = useState(booking?.notes || '');
  const [error, setError] = useState('');

  const save = async () => {
    const b: Booking = {
      id: booking?.id || crypto.randomUUID(),
      resourceType,
      resourceId,
      title,
      start: localDatetimeToUtcIso(start),
      end: localDatetimeToUtcIso(end),
      notes
    };
    const db = await dbPromise;
    const existing = await db.getAll('bookings');
    if (hasOverlap(b, existing.filter(e=>e.resourceId===resourceId && e.resourceType===resourceType))) {
      setError('Ошибка: пересечение с другой бронью');
      return;
    }
    await db.put('bookings', b);
    onSave();
  };

  return (
    <div>
      <select value={resourceType} onChange={e=>setResourceType(e.currentTarget.value as any)}>
        <option value="room">Аудитория</option>
        <option value="asset">Инвентарь</option>
      </select>
      <input type="text" placeholder="Ресурс ID" value={resourceId} onInput={e=>setResourceId(e.currentTarget.value)} />
      <input type="text" placeholder="Заголовок" value={title} onInput={e=>setTitle(e.currentTarget.value)} />
      <input type="datetime-local" value={start} onInput={e=>setStart(e.currentTarget.value)} />
      <input type="datetime-local" value={end} onInput={e=>setEnd(e.currentTarget.value)} />
      <input type="text" placeholder="Примечания" value={notes} onInput={e=>setNotes(e.currentTarget.value)} />
      <button onClick={save}>Сохранить</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}
