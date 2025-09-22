import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBySlug } from "../services/dataSource";

/**
 * Componente híbrido:
 * - Modo embutido: <Item data={objSelecionado} />
 * - Modo rota:     /item/:slug  → busca sozinho com useParams()
 */
export default function Item({ data }) {
  const params = useParams();
  const [item, setItem] = useState(data || null);
  const [loading, setLoading] = useState(!data && !!params?.slug);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false); // para o fade-in

  // Sincroniza quando recebe novo "data" via props (uso dentro da Home)
  useEffect(() => {
    if (data) {
      setItem(data);
      setError(null);
      setLoading(false);
    }
  }, [data]);

  // Busca quando usado via rota /item/:slug
  useEffect(() => {
    if (!data && params?.slug) {
      (async () => {
        try {
          setLoading(true);
          const found = await getBySlug(params.slug);
          if (!found) throw new Error("Item não encontrado");
          setItem(found);
          setError(null);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [data, params?.slug]);

  // Ativa o fade-in sempre que "item" muda
  useEffect(() => {
    if (item) {
      setShow(false);
      const t = setTimeout(() => setShow(true), 50);
      return () => clearTimeout(t);
    }
  }, [item]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!item) return <div>Nenhum item selecionado</div>;

  return (
    <div key={item.slug} className={`item-fade ${show ? "show" : ""}`}>
      <h2>{item.nome}</h2>
      {item.bairro && (
        <p>
          <b>Bairro:</b> {item.bairro}
        </p>
      )}
      {item.cidade && (
        <p>
          <b>Cidade:</b> {item.cidade}
          {item.uf ? ` - ${item.uf}` : ""}
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
