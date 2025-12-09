// frontend/src/pages/Bookings.tsx
import { useEffect, useState } from "preact/hooks";
import type { Booking } from "../utils/booking";
import BookingForm from "../components/BookingForm";
import { listBookings, deleteBooking, listRooms, listAssets } from "../store/db";
import { utcIsoToLocalString } from "../utils/time";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [adding, setAdding] = useState(false);

  const [rooms, setRooms] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "room" | "asset">("");
  const [filterResource, setFilterResource] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refresh = async () => {
    try {
      const data = await listBookings();
      setBookings(data);
    } catch (err) {
      console.error("Ошибка загрузки броней:", err);
      setBookings([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту бронь?")) return;
    try {
      await deleteBooking(id);
      await refresh();
    } catch (err: any) {
      console.error("Ошибка удаления:", err);
      alert(`Не удалось удалить бронь: ${err?.message || err}`);
    }
  };

  const getResourceName = (b: Booking) => {
    if (b.resourceType === "room") {
      return rooms.find((r) => r.id === b.resourceId)?.name || b.resourceId;
    } else {
      return assets.find((a) => a.id === b.resourceId)?.name || b.resourceId;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setRooms(await listRooms());
        setAssets(await listAssets());
        await refresh();
      } catch (err) {
        console.error("Ошибка инициализации страницы:", err);
      }
    })();
  }, []);

  const filtered = bookings.filter((b) => {
    const now = new Date();
    const isFinished = new Date(b.end) < now;

    if (statusFilter === "active" && isFinished) return false;
    if (statusFilter === "finished" && !isFinished) return false;

    const lower = search.toLowerCase();
    if (lower && !b.title.toLowerCase().includes(lower) && !b.notes?.toLowerCase().includes(lower)) return false;

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
        {!adding && !editing && <button class="add-button" onClick={() => setAdding(true)}>+ Добавить бронь</button>}
      </div>

      <div class="filters">
        <input type="text" placeholder="Поиск..." value={search} onInput={(e) => setSearch((e.target as HTMLInputElement).value)} />
        <select value={filterType} onChange={(e) => setFilterType((e.target as HTMLSelectElement).value as "room" | "asset" | "")}>
          <option value="">Тип ресурса: все</option>
          <option value="room">Аудитории</option>
          <option value="asset">Инвентарь</option>
        </select>
        <select value={filterResource} onChange={(e) => setFilterResource((e.target as HTMLSelectElement).value)}>
          <option value="">Конкретный ресурс: все</option>
          {(filterType === "" || filterType === "room") && rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          {(filterType === "" || filterType === "asset") && assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}>
          <option value="all">Статус: все</option>
          <option value="active">Активные</option>
          <option value="finished">Завершённые</option>
        </select>
        <input type="date" value={dateFrom} onInput={(e) => setDateFrom((e.target as HTMLInputElement).value)} />
        <input type="date" value={dateTo} onInput={(e) => setDateTo((e.target as HTMLInputElement).value)} />
        <button onClick={() => { setSearch(""); setFilterType(""); setFilterResource(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }}>Сбросить</button>
      </div>

      {(adding || editing) && (
        <BookingForm
          existing={editing || undefined}
          onSave={() => { setAdding(false); setEditing(null); refresh(); }}
        />
      )}

      {filtered.length === 0 && <p>Нет броней</p>}
      <div class="bookings-list">
        {filtered.map((b) => {
          const now = new Date();
          const isFinished = new Date(b.end) < now;
          const statusText = isFinished ? "Завершена" : "Активна";

          return (
            <div class="card" key={b.id}>
              <h3>{b.title}</h3>
              <p>{b.resourceType === "room" ? "Аудитория" : "Инвентарь"} – {getResourceName(b)}</p>
              <p>
                {utcIsoToLocalString(b.start, "dd.MM.yyyy HH:mm")} — {utcIsoToLocalString(b.end, "dd.MM.yyyy HH:mm")}
              </p>

              <p>
                <b>Статус:</b>{" "}
                <span class={`status ${isFinished ? "finished" : "active"}`}>
                  {statusText}
                </span>
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
          );
        })}
      </div>
    </div>
  );
}
