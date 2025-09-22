import { useEffect, useMemo, useState } from "react";
import { getAll } from "../services/dataSource";
import { Virtuoso } from "react-virtuoso";
import Item from "./Item";
import { highlightText } from "../utils/highlightText.jsx"; // 👈 import da função utilitária

export default function Home() {
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecionado, setSelecionado] = useState(null);

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
    <div style={{ display: "flex", padding: 20, gap: 20 }}>
      {/* Coluna da lista (fixa) */}
      <div style={{ width: "500px", minWidth: "280px" }}>
        <h1>Lista de Ruas</h1>

        <input
          type="text"
          placeholder="Buscar por nome/bairro/cidade…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ padding: 8, marginBottom: 16, width: "100%" }}
        />

        <p>{resultados.length} resultado(s) encontrado(s)</p>

        <Virtuoso
          style={{ height: 500, border: "1px solid #ccc" }}
          totalCount={resultados.length}
          itemContent={(index) => {
            const item = resultados[index];
            const isActive = selecionado?.slug === item.slug;
            return (
              <div
                className={`item ${isActive ? "item--active" : ""}`}
                onClick={() => setSelecionado(item)}
                title={item.nome}
              >
                {/* Aqui aplicamos o destaque */}
                {highlightText(item.nome, busca)}
                {item.bairro ? (
                  <>
                    {" — "}
                    {highlightText(item.bairro, busca)}
                  </>
                ) : null}
                {item.cidade ? (
                  <>
                    {" — "}
                    {highlightText(item.cidade, busca)}
                  </>
                ) : null}
              </div>
            );
          }}
        />
      </div>

      {/* Coluna do detalhe (estável) */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ccc",
          paddingLeft: 20,
          minHeight: "500px",
          overflowY: "auto",
        }}
      >
        {selecionado ? (
          <Item data={selecionado} />
        ) : (
          <p>Selecione uma rua na lista →</p>
        )}
      </div>
    </div>
  );
}
