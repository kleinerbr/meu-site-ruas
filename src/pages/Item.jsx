import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBySlug } from "../services/dataSource";

export default function Item({ data }) {
  const params = useParams();
  const [item, setItem] = useState(data || null);
  const [loading, setLoading] = useState(!data && !!params?.slug);
  const [error, setError] = useState(null);

  // 🔹 Busca apenas se não recebeu via props
  useEffect(() => {
    if (!data && params?.slug) {
      (async () => {
        try {
          const found = await getBySlug(params.slug);
          if (!found) throw new Error("Item não encontrado");
          setItem(found);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [data, params?.slug]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!item) return <div>Nenhum item selecionado</div>;

  return (
    <div>
      <h2>{item.nome}</h2>
      {item.bairro && (
        <p>
          <b>Bairro:</b> {item.bairro}
        </p>
      )}
      {item.cidade && (
        <p>
          <b>Cidade:</b> {item.cidade} - {item.uf}
        </p>
      )}
      {item.descricao && (
        <p>
          <b>Descrição:</b> {item.descricao}
        </p>
      )}
    </div>
  );
}
