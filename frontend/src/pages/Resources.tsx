import { useEffect, useState } from "preact/hooks";
import { listRooms, listAssets } from "../store/db";

export default function ResourcesPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setRooms(await listRooms());
      setAssets(await listAssets());
    })();
  }, []);

  return (
    <div class="container">
      <h2>Аудитории</h2>
      {rooms.map(r => (
        <div class="card" key={r.id}>
          <h3>{r.name}</h3>
          <p>Вместимость: {r.capacity}</p>
          <p>Особенности: {r.features.join(", ") || "нет"}</p>
        </div>
      ))}

      <h2>Инвентарь</h2>
      {assets.map(a => (
        <div class="card" key={a.id}>
          <h3>{a.name}</h3>
          <p>Код/серийный номер: {a.inventoryCode}</p>
          <p>Статус: {a.status}</p>
        </div>
      ))}
    </div>
  );
}