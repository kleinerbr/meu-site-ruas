import "../styles/filter-bar.css";

export default function FilterBar({
  orderBy,
  setOrderBy,
  orderDir,
  setOrderDir,
  bairro,
  setBairro,
  tipo,
  setTipo,
  bairros,
  tipos,
  colunas,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Ordenar por:</label>
        <div className="order-control">
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            {colunas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOrderDir(orderDir === "asc" ? "desc" : "asc")}
            title="Inverter ordem"
          >
            {orderDir === "asc" ? "⬆️" : "⬇️"}
          </button>
        </div>
      </div>

      <div className="filter-group">
        <label>Bairro:</label>
        <select value={bairro} onChange={(e) => setBairro(e.target.value)}>
          <option value="">Todos</option>
          {bairros.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Tipo de logradouro:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos</option>
          {tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
