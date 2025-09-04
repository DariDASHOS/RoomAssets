import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import BookingsPage from "./pages/Bookings";
import ResourcesPage from "./pages/Resources";
import { importAll } from "./store/db"; 
import seedRaw from "../../seed/seed.example.json";
import type { Booking } from "./utils/booking";
import "./styles.css";

const seed = {
  rooms: seedRaw.rooms || [],
  assets: seedRaw.assets || [],
  bookings: (seedRaw.bookings || []).map(
    (b: any): Booking => ({
      ...b,
      resourceType: b.resourceType === "room" ? "room" : "asset",
    })
  ),
};

const App = () => {
  const [page, setPage] = useState<"bookings" | "resources">("bookings");

  useEffect(() => {
    (async () => {
      try {
        await importAll(seed);
      } catch (err) {
        console.error("Ошибка загрузки seed:", err);
      }
    })();
  }, []);

  return (
    <div>
      <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        <button onClick={() => setPage("bookings")}>Брони</button>
        <button onClick={() => setPage("resources")}>Каталог ресурсов</button>
      </nav>

      {page === "bookings" ? <BookingsPage /> : <ResourcesPage />}
    </div>
  );
};

render(<App />, document.getElementById("app")!);
