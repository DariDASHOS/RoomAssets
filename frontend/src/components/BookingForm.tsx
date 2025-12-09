// frontend/src/components/BookingForm.tsx
import { useState, useEffect } from "preact/hooks";
import type { Booking } from "../utils/booking";
import {
  listRooms,
  listAssets,
  createBooking,
  updateBooking,
  listBookings,
} from "../store/db";
import { localDatetimeToUtcIso } from "../utils/time";

interface Props {
  existing?: Booking;
  onSave: () => void;
}

function isoToLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso); 
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function intervalsOverlapISO(aStartIso: string, aEndIso: string, bStartIso: string, bEndIso: string) {
  const aS = new Date(aStartIso).getTime();
  const aE = new Date(aEndIso).getTime();
  const bS = new Date(bStartIso).getTime();
  const bE = new Date(bEndIso).getTime();
  return !(aE <= bS || aS >= bE);
}

export default function BookingForm({ existing, onSave }: Props) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  const [resourceType, setResourceType] = useState<"room" | "asset">(existing?.resourceType || "room");
  const [resourceId, setResourceId] = useState(existing?.resourceId || "");
  const [title, setTitle] = useState(existing?.title || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  const [start, setStart] = useState(existing ? isoToLocalInput(existing.start) : "");
  const [end, setEnd] = useState(existing ? isoToLocalInput(existing.end) : "");

  useEffect(() => {
    (async () => {
      try {
        setRooms(await listRooms());
        setAssets(await listAssets());
        setAllBookings(await listBookings());
      } catch (err) {
        console.error("Ошибка загрузки данных для формы:", err);
      }
    })();
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!resourceId || !title || !start || !end) {
      alert("Заполните все обязательные поля!");
      return;
    }

    const startIso = localDatetimeToUtcIso(start);
    const endIso = localDatetimeToUtcIso(end);

    if (new Date(startIso).getTime() >= new Date(endIso).getTime()) {
      alert("Время начала должно быть раньше времени окончания.");
      return;
    }

    const conflict = allBookings.find(b => {
      if (existing && b.id === existing.id) return false;
      if (b.resourceId !== resourceId) return false; 
      return intervalsOverlapISO(startIso, endIso, b.start, b.end);
    });

    if (conflict) {
      alert(`Конфликт с бронью "${conflict.title}" (${conflict.id}) — ресурс занят в этот интервал.`);
      return;
    }

    const booking: Booking = {
      id: existing?.id || crypto.randomUUID(),
      resourceType,
      resourceId,
      title,
      start: startIso,
      end: endIso,
      notes,
    };

    try {
      if (existing) {
        await updateBooking(booking);
      } else {
        await createBooking(booking);
      }
      onSave();
    } catch (err: any) {
      if (err?.status === 409) {
        alert("Сервер отклонил бронь: ресурс занят в этот интервал (серверная проверка).");
      } else {
        console.error("Ошибка при сохранении:", err);
        alert(`Не удалось сохранить бронь: ${err?.message || err}`);
      }
    }
  };

  return (
    <div class="form-card">
      <h3>{existing ? "Редактировать бронь" : "Новая бронь"}</h3>
      <form onSubmit={handleSubmit} class="form-grid">
        <label>
          Тип ресурса
          <select value={resourceType} onChange={(e) => setResourceType((e.target as HTMLSelectElement).value as "room" | "asset")}>
            <option value="room">Аудитория</option>
            <option value="asset">Инвентарь</option>
          </select>
        </label>

        <label>
          Ресурс
          <select value={resourceId} onChange={(e) => setResourceId((e.target as HTMLSelectElement).value)}>
            <option value="">-- выберите --</option>
            {resourceType === "room" &&
              rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            {resourceType === "asset" &&
              assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>

        <label>
          Название события
          <input
            type="text"
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          />
        </label>

        <label>
          Начало
          <input
            type="datetime-local"
            value={start}
            onInput={(e) => setStart((e.target as HTMLInputElement).value)}
          />
        </label>

        <label>
          Конец
          <input
            type="datetime-local"
            value={end}
            onInput={(e) => setEnd((e.target as HTMLInputElement).value)}
          />
        </label>

        <label>
          Примечание
          <textarea
            value={notes}
            onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
          />
        </label>

        <div class="form-buttons">
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onSave}>Отмена</button>
        </div>
      </form>
    </div>
  );
}
