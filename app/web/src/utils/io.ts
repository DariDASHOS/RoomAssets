import { exportAll, importAll } from "../store/db";

export async function exportToJson() {
  const data = await exportAll();
  return JSON.stringify(data, null, 2);
}

export async function importFromJson(json: string) {
  const data = JSON.parse(json);
  await importAll(data);
}
