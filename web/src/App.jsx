import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [etat, setEtat] = useState("verification...");
  const [ok, setOk] = useState(false);
  const [taches, setTaches] = useState([]);

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then((r) => r.json())
      .then((data) => {
        setTaches(data.tasks || []);
        setOk(true);
        setEtat("API : connectée à PostgreSQL");
      })
      .catch(() => setEtat("API : injoignable"));
  }, []);

  return (
    <main className="carte">
      <p className="etiquette">ISET Gafsa — TP Docker 4</p>
      <h1>Pile Compose : web, api, db</h1>
      <p className="etat">
        {etat} <span className={ok ? "point ok" : "point ko"}></span>
      </p>
      <ul className="liste">
        {taches.map((t) => (
          <li key={t.id} className={t.fait ? "fait" : ""}>{t.titre}</li>
        ))}
      </ul>
      <p className="pied">Données lues sur {API}/tasks — service api — base db</p>
    </main>
  );
}
