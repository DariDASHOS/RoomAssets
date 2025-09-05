import { exportAll, importAll } from "../store/db";

export async function exportToFile(filename = "roomassets-export.json") {
  const data = await exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importFromFile(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  await importAll(data);
}
