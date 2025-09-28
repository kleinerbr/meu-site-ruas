// src/components/Footer.jsx
export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer>
      <p>
        © {ano} — Ruas de Maceió | Desenvolvido por [Seu Nome] <br />
        Localização: Maceió - AL
      </p>
    </footer>
  );
}
