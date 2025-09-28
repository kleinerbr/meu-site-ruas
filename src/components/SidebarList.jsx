// src/components/SidebarList.jsx
import { highlightText } from "../utils/highlightText";

export default function SidebarList({
  resultados,
  selecionado,
  onSelect,
  busca,
}) {
  return (
    <aside className="sidebar">
      <h2>Resultados</h2>
      <p>{resultados.length} resultado(s) encontrado(s)</p>

      {resultados.length === 0 && <p>Nenhum item encontrado</p>}

      {resultados.map((item) => {
        const isActive = selecionado?.slug === item.slug;
        return (
          <div
            key={item.slug}
            className={`item ${isActive ? "item--active" : ""}`}
            onClick={() => onSelect(item)}
          >
            {/* Destaque no nome/bairro/cidade usando a função highlight */}
            {highlightText(item.nome, busca)}
            {item.bairro && (
              <>
                {" — "}
                {highlightText(item.bairro, busca)}
              </>
            )}
            {item.cidade && (
              <>
                {" — "}
                {highlightText(item.cidade, busca)}
              </>
            )}
          </div>
        );
      })}
    </aside>
  );
}
