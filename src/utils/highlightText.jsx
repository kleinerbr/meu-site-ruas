// src/utils/highlightText.jsx
export function highlightText(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
