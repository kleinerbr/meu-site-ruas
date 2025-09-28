import Papa from "papaparse";

const MODE = import.meta.env.VITE_DATA_MODE ?? "MOCK";

// Normaliza nomes de campos do CSV: minúsculas, sem acentos, colapsa espaços
function normKey(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Lê o primeiro campo disponível entre os aliases informados
function field(normRow, ...aliases) {
  for (const k of aliases) {
    const val = normRow[normKey(k)];
    if (val != null && String(val).trim() !== "") return String(val).trim();
  }
  return "";
}

// Helper para título resumido: "Tipo Título Nome"
export function getResumoNome(item) {
  return [item.tipo, item.titulo, item.nome].filter(Boolean).join(" ");
}

export async function getAll() {
  if (MODE === "MOCK") return mockData; // mantém seu mock, se existir

  if (MODE === "CSV") {
    const url = import.meta.env.VITE_SHEET_CSV_URL;
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const seenSlugs = new Set();

    const rows = parsed.data.map((raw, i) => {
      // cria um objeto com chaves normalizadas
      const norm = {};
      for (const [k, v] of Object.entries(raw)) {
        norm[normKey(k)] = typeof v === "string" ? v.trim() : v;
      }

      const id = field(norm, "id") || String(i + 1);

      // CSV da sua planilha (com espaços/acentos)
      const tipo = field(norm, "Tipo de logradouro", "tipo");
      const titulo = field(norm, "Título", "Titulo", "titulo");
      const nome = field(norm, "Nome do logradouro", "nome");

      // Outros campos úteis (opcionais)
      const bairro = field(norm, "Bairro principal", "bairro");
      const cidade = field(norm, "Município", "Municipio", "cidade");
      const uf = field(norm, "UF", "Estado");
      const link = field(norm, "Link");
      const leiNum = field(norm, "Número da lei", "Numero da lei");
      const leiData = field(norm, "Data da lei");
      const leiTxt = field(norm, "Texto da lei", "descricao", "descrição");

      // slug baseado no nome (fallback no id se vazio/duplicado)
      let base = nome || id;
      let slug = slugify(base);
      if (seenSlugs.has(slug)) slug = `${slug}-${id}`;
      seenSlugs.add(slug);

      return {
        id,
        tipo,
        titulo,
        nome,
        bairro,
        cidade,
        uf,
        link,
        numeroDaLei: leiNum,
        dataDaLei: leiData,
        descricao: leiTxt,
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
