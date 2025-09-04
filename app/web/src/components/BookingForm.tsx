import { useState, useEffect } from "preact/hooks";
import { createBooking, updateBooking, listRooms, listAssets } from "../store/db";
import type { Booking } from "../utils/booking";

interface Props {
  existing?: Booking;
  onSave: () => void;
}

export default function BookingForm({ existing, onSave }: Props) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  const [resourceType, setResourceType] = useState<"room" | "asset">(existing?.resourceType || "room");
  const [resourceId, setResourceId] = useState(existing?.resourceId || "");
  const [title, setTitle] = useState(existing?.title || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  const [start, setStart] = useState(existing?.start ? existing.start.slice(0,16) : "");
  const [end, setEnd] = useState(existing?.end ? existing.end.slice(0,16) : "");

  useEffect(() => {
    (async () => {
      setRooms(await listRooms());
      setAssets(await listAssets());
    })();
  }, []);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!resourceId || !title || !start || !end) {
      alert("Заполните все обязательные поля!");
      return;
    }

    const booking: Booking = {
      id: existing?.id || crypto.randomUUID(),
      resourceType,
      resourceId,
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      notes,
    };

    if (existing) {
      await updateBooking(booking);
    } else {
      await createBooking(booking);
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} class="form">
      <label>
        Ресурс:
        <select value={resourceType} onChange={(e) => setResourceType((e.target as HTMLSelectElement).value as "room" | "asset")}>
          <option value="room">Аудитория</option>
          <option value="asset">Инвентарь</option>
        </select>
      </label>

      <label>
        Выбор ресурса:
        <select value={resourceId} onChange={(e) => setResourceId((e.target as HTMLSelectElement).value)}>
          <option value="">-- выберите --</option>
          {resourceType === "room" &&
            rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          {resourceType === "asset" &&
            assets.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </label>

      <label>
        Название:
        <input
          type="text"
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
        />
      </label>

      <label>
        Начало:
        <input
          type="datetime-local"
          value={start}
          onInput={(e) => setStart((e.target as HTMLInputElement).value)}
        />
      </label>

      <label>
        Конец:
        <input
          type="datetime-local"
          value={end}
          onInput={(e) => setEnd((e.target as HTMLInputElement).value)}
        />
      </label>

      <label>
        Примечание:
        <textarea
          value={notes}
          onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
        />
      </label>

      <button type="submit">Сохранить</button>
    </form>
  );
}
