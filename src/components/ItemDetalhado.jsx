import { useNavigate } from "react-router-dom";
import { getResumoNome } from "../services/dataSource";
import "../styles/item-detalhado.css";

export default function ItemDetalhado({ item, onClose }) {
  const navigate = useNavigate();

  if (!item) return null;

  const ignorar = new Set([
    "id",
    "slug",
    "tipo",
    "titulo",
    "nome",
    "bairro",
    "Link",
  ]);

  const handleBack = () => {
    if (onClose) {
      onClose(); // fecha painel lateral (MainLayout)
    } else {
      navigate("/"); // volta pra Home (rota direta)
    }
  };

  const backLabel = onClose ? "← Voltar à busca" : "← Ir para página inicial";

  return (
    <div className="item-detalhado">
      <button onClick={handleBack} style={{ marginBottom: "1rem" }}>
        {backLabel}
      </button>

      {/* título principal */}
      <h2>{getResumoNome(item) || "(sem nome)"}</h2>
      {/* Exibe o link completo */}
      <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
        <i>Link direto:</i>{" "}
        <a
          href={`/item/${item.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#66aaff" }}
        >
          {window.location.origin}/item/{item.slug}
        </a>
      </p>
      {/* lista dinâmica */}
      <div className="detalhes">
        {Object.entries(item).map(([coluna, valor]) => {
          if (!valor || ignorar.has(coluna)) return null;
          return (
            <p key={coluna}>
              <b>{coluna}:</b> {valor}
            </p>
          );
        })}
      </div>
    </div>
  );
}
