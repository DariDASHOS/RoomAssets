import { useEffect, useState } from 'preact/hooks';
import { dbPromise } from '../store/db';
import BookingForm from '../components/BookingForm';
import type { Booking } from '../utils/booking';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const load = async () => {
      const db = await dbPromise;
      const all = await db.getAll('bookings');
      setBookings(all);
    }
    load();
  }, [reloadFlag]);

  return (
    <div>
      <h2>Брони</h2>
      <BookingForm onSave={() => setReloadFlag(!reloadFlag)} />
      <ul>
        {bookings.map(b => (
          <li key={b.id}>{b.title} {b.start} - {b.end}</li>
        ))}
      </ul>
    </div>
  );
}
