// src/components/Grid.jsx
import ItemResumo from "./ItemResumo";

export default function Grid({ resultados, onSelect }) {
  return (
    <div className="grid">
      {resultados.length === 0 && <p>Nenhum item encontrado</p>}

      {resultados.map((item) => (
        <ItemResumo
          key={item.slug}
          item={item}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}
