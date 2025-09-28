// src/components/Header.jsx
export default function Header({ busca, setBusca }) {
  return (
    <header>
      <h1>Ruas de Maceió</h1>

      <div className="header-actions">
        <button onClick={() => (window.location.href = "/")}>
          Página inicial
        </button>

        <input
          type="text"
          placeholder="Buscar por nome, bairro ou cidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </header>
  );
}
