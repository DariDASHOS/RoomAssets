import { useEffect, useState } from 'preact/hooks';
import { dbPromise } from '../store/db';

type Room = {
  id: string;
  name: string;
  capacity: number;
  features: string[];
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      const db = await dbPromise;
      const allRooms = await db.getAll('rooms');
      setRooms(allRooms);
    };
    loadRooms();
  }, []);

  // фильтруем по названию и признакам
  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(filter.toLowerCase()) ||
    r.features.some(f => f.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Каталог аудиторий</h2>

      <input
        type="text"
        placeholder="Поиск по названию или признакам..."
        value={filter}
        onInput={e => setFilter(e.currentTarget.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Название</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Вместимость</th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' }}>Признаки</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map(r => (
            <tr key={r.id}>
              <td style={{ padding: '0.5rem' }}>{r.name}</td>
              <td style={{ padding: '0.5rem' }}>{r.capacity}</td>
              <td style={{ padding: '0.5rem' }}>{r.features.join(', ') || '-'}</td>
            </tr>
          ))}
          {filteredRooms.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                Аудитории не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
