import { useEffect, useState } from "preact/hooks";
import { listRooms } from "../store/db";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setRooms(await listRooms());
    })();
  }, []);

  return (
    <div class="container">
      <h2>Аудитории</h2>
      {rooms.length === 0 && <p>Нет аудиторий</p>}
      {rooms.map((r) => (
        <div class="card" key={r.id}>
          <h3>{r.name}</h3>
          <p>Вместимость: {r.capacity}</p>
          <p>Особенности: {r.features.join(", ") || "нет"}</p>
        </div>
      ))}
    </div>
  );
}
