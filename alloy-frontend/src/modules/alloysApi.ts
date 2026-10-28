export interface Alloys {
  id: number;
  title: string;
  description: string;
  energy_kev: number;     // Первая высшая частота (кэВ) — поле фильтрации
  intensity_cps: number;  // Вторая высшая частота / интенсивность (cps)
  status: string;         // "published" | "draft" | "deleted"
  image_url: string;
  video_url: string;
  likes_count: number;
}

export interface AlloysCatalogResult {
  resultCount: number;
  results: Alloys[];
}

// Получение каталога сплавов с фильтрацией по энергии
export const getAlloysByEnergy = async (energy = "0"): Promise<AlloysCatalogResult> => {
  const query = energy ? `?energy=${encodeURIComponent(energy)}` : "";
  return fetch(`/api/alloyCatalog${query}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      // Поддержка как массива напрямую, так и обертки { results: [...] }
      const list: Alloys[] = Array.isArray(data) ? data : data.results || data.alloys || [];
      return { resultCount: list.length, results: list };
    });
};

// Получение одного сплава по ID для страницы Ленты
export const getAlloysById = async (id: number | string): Promise<Alloys | undefined> => {
  return fetch(`/api/alloyFeed?id=${id}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => data.alloy || data);
};
