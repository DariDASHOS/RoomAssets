RoomAssets — система бронирования ресурсов

Возможности:
- Каталог аудиторий и инвентаря.
- Создание, редактирование и удаление брони.
- Расширенный поиск и фильтрация.
- Проверка пересечений интервалов.
- Экспорт и импорт JSON.
- Локальное хранение (IndexedDB).

Требования:
- Node.js >= 18
- npm >= 9

Установка:
git clone https://github.com/DariDASHOS/RoomAssets.git
cd RoomAssets/app/web
npm install

Переустановка зависимостей:
rm -rf node_modules package-lock.json
npm install

Запуск:
npm run dev
Приложение откроется на http://localhost:5173

Сборка: 
npm run build
Готовый билд появится в dist/.

Release:
Собранный артефакт нужно скопировать в папку release/.

Импорт seed:
Для начального наполнения можно использовать seed.example.json через кнопку «Импорт JSON».
