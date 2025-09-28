// src/pages/Item.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBySlug } from "../services/dataSource";
import ItemDetalhado from "../components/ItemDetalhado";

export default function Item() {
  const params = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getBySlug(params.slug);
      setItem(data);
      setLoading(false);
    })();
  }, [params.slug]);

  if (loading) return <div>Carregando…</div>;
  if (!item) return <div>Item não encontrado</div>;

  return <ItemDetalhado item={item} fromSlug={true} />;
}
