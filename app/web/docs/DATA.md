DATA.md — Модель данных

Сущности:

- Room
{
  "id": "room-101",
  "name": "Аудитория 101"
}

- Asset
{
  "id": "projector-1",
  "name": "Проектор Epson"
}

- Booking
{
  "id": "booking-123",
  "title": "Лекция по математике",
  "resourceType": "room",
  "resourceId": "room-101",
  "start": "2025-09-16T12:00:00Z",
  "end": "2025-09-16T13:30:00Z",
  "notes": "Понадобится проектор"
}

- Seed.example.json
Файл содержит массивы rooms, assets, bookings для начальной загрузки.
