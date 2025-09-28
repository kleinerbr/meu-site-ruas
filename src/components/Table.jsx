// src/components/Table.jsx
export default function Table({ resultados, onSelect }) {
  if (!resultados || resultados.length === 0) {
    return <p>Nenhum item encontrado</p>;
  }

  return (
    <table className="result-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Título</th>
          <th>Nome do logradouro</th>
          <th>Bairro</th>
        </tr>
      </thead>
      <tbody>
        {resultados.map((item) => (
          <tr key={item.slug} onClick={() => onSelect(item)}>
            <td>{item.tipo}</td>
            <td>{item.titulo}</td>
            <td>{item.nome}</td>
            <td>{item.bairro}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
