import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAll } from "../services/dataSource";
import { Virtuoso } from "react-virtuoso";

export default function Home() {
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (item) =>
        (item.nome ?? "").toLowerCase().includes(q) ||
        (item.bairro ?? "").toLowerCase().includes(q) ||
        (item.cidade ?? "").toLowerCase().includes(q)
    );
  }, [busca, rows]);

  if (loading) return <div style={{ padding: 20 }}>Carregando…</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Lista de Ruas</h1>

      <input
        type="text"
        placeholder="Buscar por nome ou bairro..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ padding: 8, marginBottom: 16, width: "100%", maxWidth: 400 }}
      />

      <p>{resultados.length} resultado(s) encontrado(s)</p>

      <Virtuoso
        style={{ height: "500px", border: "1px solid #ccc" }}
        totalCount={resultados.length}
        itemContent={(index) => {
          const item = resultados[index];
          return (
            <div style={{ padding: "6px 10px" }}>
              <Link to={`/item/${item.slug}`}>
                {item.nome} {item.bairro ? `— ${item.bairro}` : ""}
              </Link>
            </div>
          );
        }}
      />
    </div>
  );
}
