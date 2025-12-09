import { render } from "preact";
import { useState } from "preact/hooks";
import BookingsPage from "./pages/Bookings";
import ResourcesPage from "./pages/Resources";
import "./styles.css";

const App = () => {
  const [page, setPage] = useState<"bookings" | "resources">("bookings");

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
