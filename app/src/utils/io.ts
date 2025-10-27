import { exportAll, importAll } from "../store/db";

export async function exportToFile() {
  const data = await exportAll();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "roomassets_export.json";
  a.click();

  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  await importAll(data);
}
