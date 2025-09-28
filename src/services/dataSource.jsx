import Papa from "papaparse";

const MODE = import.meta.env.VITE_DATA_MODE ?? "MOCK";

export async function getAll() {
  if (MODE === "MOCK") return mockData;

  if (MODE === "CSV") {
    const url = import.meta.env.VITE_SHEET_CSV_URL;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const seenSlugs = new Set();

    const rows = parsed.data.map((raw, i) => {
      // mantém todos os campos originais, com o nome do cabeçalho intacto
      const norm = {};
      for (const [k, v] of Object.entries(raw)) {
        norm[k.trim()] = typeof v === "string" ? v.trim() : v;
      }

      // garante ID
      const id = norm["id"] || String(i + 1);

      // slug baseado no Nome do logradouro ou ID
      let base = norm["Nome do logradouro"] || id;
      let slug = slugify(base);
      if (seenSlugs.has(slug)) slug = `${slug}-${id}`;
      seenSlugs.add(slug);

      return {
        ...norm, // 👈 inclui TODAS as colunas originais
        id,
        slug,
        // aliases fixos
        tipo: norm["Tipo de logradouro"] ?? "",
        titulo: norm["Título"] ?? norm["Titulo"] ?? "",
        nome: norm["Nome do logradouro"] ?? "",
        bairro: norm["Bairro principal"] ?? "",
      };
    });

    return rows;
  }

  throw new Error(`VITE_DATA_MODE inválido: ${MODE}`);
}

export async function getBySlug(slug) {
  const all = await getAll();
  return (
    all.find((r) => r.slug === slug || String(r.id) === String(slug)) ?? null
  );
}

export function getResumoNome(item) {
  return [item.tipo, item.titulo, item.nome].filter(Boolean).join(" ");
}

function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
