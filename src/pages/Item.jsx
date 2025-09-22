import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBySlug } from "../services/dataSource";

export default function Item() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => setItem(await getBySlug(slug)))();
  }, [slug]);

  if (!item) return <div style={{ padding: 20 }}>Carregando…</div>;

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">← Voltar</Link>
      <h1>{item.nome}</h1>
      {item.bairro && (
        <p>
          <strong>Bairro:</strong> {item.bairro}
        </p>
      )}
      {item.cidade && (
        <p>
          <strong>Cidade/UF:</strong> {item.cidade}
          {item.uf ? `/${item.uf}` : ""}
        </p>
      )}
      {item.descricao && <p>{item.descricao}</p>}
    </div>
  );
}
