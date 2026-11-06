export function ContainsSearch(data: any, search: string): boolean {
  const keyword = search.toLowerCase();

  // Kalau string, langsung cari
  if (typeof data === "string") {
    return data.toLowerCase().includes(keyword);
  }

  // Kalau array, cari ke setiap item
  if (Array.isArray(data)) {
    return data.some((item) => ContainsSearch(item, search));
  }

  // Kalau object, cari ke semua value
  if (data !== null && typeof data === "object") {
    return Object.values(data).some((value) => ContainsSearch(value, search));
  }

  return false;
}
