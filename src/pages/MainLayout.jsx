import { useState, useMemo, useEffect } from "react";
import { getAll, getResumoNome } from "../services/dataSource";

import Header from "../components/Header";
import FilterBar from "../components/FilterBar.jsx";
import Grid from "../components/Grid";
import Table from "../components/Table";
import ItemDetalhado from "../components/ItemDetalhado";
import Footer from "../components/Footer";

import "../styles/layout.css";

// Função auxiliar para ordenação inteligente
function smartCompare(a, b, dir = "asc") {
  if (a == null) a = "";
  if (b == null) b = "";

  // tenta número
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (!isNaN(numA) && !isNaN(numB)) {
    return dir === "asc" ? numA - numB : numB - numA;
  }

  // tenta data
  const dateA = Date.parse(a);
  const dateB = Date.parse(b);
  if (!isNaN(dateA) && !isNaN(dateB)) {
    return dir === "asc" ? dateA - dateB : dateB - dateA;
  }

  // fallback: string
  return dir === "asc"
    ? String(a).localeCompare(String(b))
    : String(b).localeCompare(String(a));
}

export default function MainLayout() {
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selecionado, setSelecionado] = useState(null);
  const [modoVisualizacao, setModoVisualizacao] = useState("grid");

  // 🔹 novos estados de filtro/ordenação
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [orderBy, setOrderBy] = useState("Nome do logradouro");
  const [orderDir, setOrderDir] = useState("asc");

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

  // Filtra e ordena resultados
  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    let filtrados = rows;

    // 🔍 busca textual
    if (q) {
      filtrados = filtrados.filter(
        (item) =>
          (getResumoNome(item) ?? "").toLowerCase().includes(q) ||
          (item.bairro ?? "").toLowerCase().includes(q)
      );
    }

    // 🎯 filtros adicionais
    if (bairro) filtrados = filtrados.filter((i) => i.bairro === bairro);
    if (tipo) filtrados = filtrados.filter((i) => i.tipo === tipo);

    // ↕️ ordenação
    filtrados = [...filtrados].sort((a, b) =>
      smartCompare(a[orderBy], b[orderBy], orderDir)
    );

    return filtrados;
  }, [busca, rows, bairro, tipo, orderBy, orderDir]);

  if (loading) return <div>Carregando…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="layout">
      {/* Cabeçalho */}
      <Header busca={busca} setBusca={setBusca} />

      {/* Filtros */}
      <FilterBar
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        orderDir={orderDir}
        setOrderDir={setOrderDir}
        bairro={bairro}
        setBairro={setBairro}
        tipo={tipo}
        setTipo={setTipo}
        bairros={[...new Set(rows.map((r) => r.bairro).filter(Boolean))].sort()}
        tipos={[...new Set(rows.map((r) => r.tipo).filter(Boolean))].sort()}
        colunas={Object.keys(rows[0] || {})}
      />

      {/* Conteúdo principal */}
      <div className="layout-right">
        {selecionado ? (
          <ItemDetalhado
            item={selecionado}
            onClose={() => setSelecionado(null)}
          />
        ) : (
          <>
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
