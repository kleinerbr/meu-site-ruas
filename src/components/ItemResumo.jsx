// src/components/ItemResumo.jsx
import { getResumoNome } from "../services/dataSource";

// Retorna o primeiro campo não vazio entre várias opções
function pick(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== "") {
      return { key: k, value: v };
    }
  }
  return null;
}

export default function ItemResumo({ item, onClick }) {
  const bairro = pick(item, ["Bairro principal", "Bairro", "Demais bairros"]);
  const cidade = pick(item, ["Cidade", "Município", "Municipio"]);
  const uf = pick(item, ["UF", "Estado"]);

  return (
    <div className="item-resumo" onClick={onClick}>
      {/* 👉 agora o título vem montado pela função centralizada */}
      <h3>{getResumoNome(item) || "(sem nome)"}</h3>

      {bairro && (
        <p>
          <b>{bairro.key}:</b> {bairro.value}
        </p>
      )}

      {(cidade || uf) && (
        <p>
          {cidade ? (
            <>
              <b>{cidade.key}:</b> {cidade.value}
            </>
          ) : null}
          {uf ? (
            cidade ? (
              ` - ${uf.value}`
            ) : (
              <>
                <b>{uf.key}:</b> {uf.value}
              </>
            )
          ) : null}
        </p>
      )}
    </div>
  );
}
