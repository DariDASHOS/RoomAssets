import { useEffect, useRef, useState } from "preact/hooks";
import { listBookings, deleteBooking, listRooms, listAssets } from "../store/db";
import type { Booking } from "../utils/booking";
import BookingForm from "../components/BookingForm";
import { exportToFile, importFromFile } from "../utils/io";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [adding, setAdding] = useState(false);

  const [rooms, setRooms] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const data = await listBookings();
    setBookings(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту бронь?")) return;
    await deleteBooking(id);
    refresh();
  };

  const getResourceName = (b: Booking) => {
    if (b.resourceType === "room") {
      return rooms.find((r) => r.id === b.resourceId)?.name || b.resourceId;
    } else {
      return assets.find((a) => a.id === b.resourceId)?.name || b.resourceId;
    }
  };

  const handleExport = async () => {
    await exportToFile();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      await importFromFile(file);
      await refresh();
      alert("Импорт выполнен");
    } catch (err: any) {
      alert(`Ошибка импорта: ${err.message || err}`);
    } finally {
      input.value = "";
    }
  };

  useEffect(() => {
    (async () => {
      setRooms(await listRooms());
      setAssets(await listAssets());
      refresh();
    })();
  }, []);

  return (
    <div class="container">
      <h2>Брони</h2>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", margin: "0.5rem 0 1rem" }}>
        {!adding && !editing && (
          <button class="add-button" onClick={() => setAdding(true)}>+ Добавить бронь</button>
        )}
        <button onClick={handleExport}>Экспорт JSON</button>
        <button onClick={handleImportClick}>Импорт JSON</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
      </div>

      {(adding || editing) && (
        <BookingForm
          existing={editing || undefined}
          onSave={() => {
            setAdding(false);
            setEditing(null);
            refresh();
          }}
        />
      )}

      {bookings.length === 0 && <p>Нет броней</p>}
      <div class="bookings-list">
        {bookings.map((b) => (
          <div class="card" key={b.id}>
            <h3>{b.title}</h3>
            <p>{b.resourceType === "room" ? "Аудитория" : "Инвентарь"} – {getResourceName(b)}</p>
            <p>
              {new Date(b.start).toLocaleString()} — {new Date(b.end).toLocaleString()}
            </p>
            {b.notes && <p><i>{b.notes}</i></p>}
            <div class="card-buttons">
              <button onClick={() => setEditing(b)}>Редактировать</button>
              <button onClick={() => handleDelete(b.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
