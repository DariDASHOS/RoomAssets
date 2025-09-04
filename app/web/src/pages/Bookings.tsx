// app/web/src/pages/Bookings.tsx
import { useEffect, useState } from "preact/hooks";
import { listBookings, createBooking } from "../store/db";
import type { Booking } from "../utils/booking";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const data = await listBookings();
    setBookings(data);
  }

  async function addBooking() {
    try {
      setError(null);
      await createBooking({
        id: crypto.randomUUID(),
        resourceType: "room",
        resourceId: "r-101",
        title: "Тестовое занятие",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        notes: "Проверка интерфейса"
      });
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div class="container">
      <h2>Брони</h2>

      <button onClick={addBooking}>Добавить тестовую бронь</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.map(b => (
        <div key={b.id} class="card">
          <h3>{b.title}</h3>
          <p class="text-muted">
            {b.resourceType} – {b.resourceId}
          </p>
          <p>
            {new Date(b.start).toLocaleString()} → {new Date(b.end).toLocaleString()}
          </p>
          {b.notes && <p><i>{b.notes}</i></p>}
        </div>
      ))}
    </div>
  );
}
