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

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "room" | "asset">("");
  const [filterResource, setFilterResource] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  const filtered = bookings.filter((b) => {
    const lower = search.toLowerCase();
    if (
      lower &&
      !b.title.toLowerCase().includes(lower) &&
      !b.notes?.toLowerCase().includes(lower)
    )
      return false;

    if (filterType && b.resourceType !== filterType) return false;

    if (filterResource && b.resourceId !== filterResource) return false;

    if (dateFrom && new Date(b.start) < new Date(dateFrom)) return false;
    if (dateTo && new Date(b.end) > new Date(dateTo)) return false;

    return true;
  });

  return (
    <div class="container">
      <h2>Брони</h2>

      <div class="actions">
        {!adding && !editing && (
          <button class="add-button" onClick={() => setAdding(true)}>
            + Добавить бронь
          </button>
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

      <div class="filters">
        <input
          type="text"
          placeholder="Поиск по названию или примечанию..."
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        />

        <select
          value={filterType}
          onChange={(e) =>
            setFilterType((e.target as HTMLSelectElement).value as any)
          }
        >
          <option value="">Тип ресурса: все</option>
          <option value="room">Аудитории</option>
          <option value="asset">Инвентарь</option>
        </select>

        <select
          value={filterResource}
          onChange={(e) =>
            setFilterResource((e.target as HTMLSelectElement).value)
          }
        >
          <option value="">Конкретный ресурс: все</option>
          {(filterType === "" || filterType === "room") &&
            rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          {(filterType === "" || filterType === "asset") &&
            assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onInput={(e) => setDateFrom((e.target as HTMLInputElement).value)}
        />
        <input
          type="date"
          value={dateTo}
          onInput={(e) => setDateTo((e.target as HTMLInputElement).value)}
        />

        <button
          onClick={() => {
            setSearch("");
            setFilterType("");
            setFilterResource("");
            setDateFrom("");
            setDateTo("");
          }}
        >
          Сбросить
        </button>
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

      {filtered.length === 0 && <p>Нет броней</p>}
      <div class="bookings-list">
        {filtered.map((b) => (
          <div class="card" key={b.id}>
            <h3>{b.title}</h3>
            <p>
              {b.resourceType === "room" ? "Аудитория" : "Инвентарь"} –{" "}
              {getResourceName(b)}
            </p>
            <p>
              {new Date(b.start).toLocaleString()} —{" "}
              {new Date(b.end).toLocaleString()}
            </p>
            {b.notes && (
              <p>
                <i>{b.notes}</i>
              </p>
            )}
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
