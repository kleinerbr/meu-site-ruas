import { mockData } from "../data/mock";
import Papa from "papaparse";

const MODE = import.meta.env.VITE_DATA_MODE ?? "MOCK";

export async function getAll() {
  if (MODE === "MOCK") return mockData;

  if (MODE === "CSV") {
    const url = import.meta.env.VITE_SHEET_CSV_URL;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const seenSlugs = new Set();

    let rows = parsed.data.map((obj, i) => {
      const id = String(obj.id || i + 1).trim();
      const nome = (obj.nome || "").trim();

      // gera slug base
      let slug = slugify(nome || id);

      // garante unicidade
      if (seenSlugs.has(slug)) {
        slug = `${slug}-${id}`;
      }
      seenSlugs.add(slug);

      return {
        id,
        nome,
        bairro: (obj.bairro || "").trim(),
        cidade: (obj.cidade || "").trim(),
        uf: (obj.uf || "").trim(),
        descricao: (obj.descricao || "").trim(),
        slug,
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

function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
