// src/components/ItemResumo.jsx
import { getResumoNome } from "../services/dataSource";

export default function ItemResumo({ item, onClick }) {
  return (
    <div className="item-resumo" onClick={onClick}>
      {/* título resumido → Tipo + Título + Nome */}
      <h3>{getResumoNome(item) || "(sem nome)"}</h3>

      {item.bairro && (
        <p>
          <b>Bairro:</b> {item.bairro}
        </p>
      )}

      {(item.cidade || item.uf) && (
        <p>
          {item.cidade ? (
            <>
              <b>Cidade:</b> {item.cidade}
            </>
          ) : null}
          {item.uf ? (
            item.cidade ? (
              ` - ${item.uf}`
            ) : (
              <>
                <b>UF:</b> {item.uf}
              </>
            )
          ) : null}
        </p>
      )}
    </div>
  );
}
