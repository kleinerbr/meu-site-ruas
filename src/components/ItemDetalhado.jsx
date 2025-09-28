// src/components/ItemDetalhado.jsx
export default function ItemDetalhado({ item, onClose, fromSlug = false }) {
  if (!item) return <p>Nenhum item selecionado</p>;

  const ignorar = ["id", "slug"]; // não exibir id nem slug

  return (
    <div className="item-detalhado">
      {fromSlug ? (
        <button
          onClick={() => (window.location.href = "/")}
          className="btn-voltar"
        >
          🏠 Ir para página inicial
        </button>
      ) : (
        <button onClick={onClose} className="btn-voltar">
          ← Voltar à busca
        </button>
      )}

      {Object.entries(item).map(([coluna, valor]) => {
        if (!valor || ignorar.includes(coluna)) return null;
        return (
          <p key={coluna}>
            <b>{coluna}:</b> {valor}
          </p>
        );
      })}
    </div>
  );
}
