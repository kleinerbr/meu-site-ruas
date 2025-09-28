// src/pages/MainLayout.jsx
import { useState, useMemo, useEffect } from "react";
import { getAll, getResumoNome } from "../services/dataSource";

import Header from "../components/Header";
import Grid from "../components/Grid";
import Table from "../components/Table";
import ItemDetalhado from "../components/ItemDetalhado";
import Footer from "../components/Footer";

import "../styles/layout.css";

export default function MainLayout() {
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [modoVisualizacao, setModoVisualizacao] = useState("grid"); // 👈 novo estado

  // Carrega dados da planilha (CSV)
  useEffect(() => {
    (async () => {
      try {
        const data = await getAll();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtra resultados conforme busca
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

  if (loading) return <div>Carregando…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="layout">
      {/* Cabeçalho */}
      <Header busca={busca} setBusca={setBusca} />

      {/* Conteúdo principal */}
      <div className="layout-right">
        {selecionado ? (
          <ItemDetalhado
            item={selecionado}
            onClose={() => setSelecionado(null)}
          />
        ) : (
          <>
            {/* Alternador de visualização */}
            <div className="view-toggle">
              <button
                onClick={() => setModoVisualizacao("grid")}
                className={modoVisualizacao === "grid" ? "active" : ""}
              >
                📦 Visualizar em grade
              </button>
              <button
                onClick={() => setModoVisualizacao("table")}
                className={modoVisualizacao === "table" ? "active" : ""}
              >
                📋 Visualizar em tabela
              </button>
            </div>

            {/* Resultados */}
            {modoVisualizacao === "grid" ? (
              <Grid resultados={resultados} onSelect={setSelecionado} />
            ) : (
              <Table resultados={resultados} onSelect={setSelecionado} />
            )}
          </>
        )}
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
