import { ALLOYS_MOCK } from "./mock";

export interface Alloys {
  id: number;
  title: string;
  description: string;
  energy_kev: number;
  second_energy_kev?: number;
  intensity_cps: number;
  status: string;
  image_url: string;
  video_url: string;
  likes_count?: number;
}

export interface AlloyFeedResponse {
  alloy: Alloys;
  likes: number;
  is_mine: number;
  is_liked: number;
}

export interface AlloyCatalogResult {
  resultCount: number;
  results: Alloys[];
}

const normalizeAlloy = (raw: any, likesCount?: number): Alloys => ({
  id: Number(raw?.id ?? raw?.ID ?? raw?.alloy_id ?? 0),
  title: raw?.title ?? raw?.Title ?? raw?.name ?? raw?.Name ?? raw?.alloy_name ?? "",
  description: raw?.description ?? raw?.Description ?? raw?.alloy_description ?? "",
  energy_kev: Number(raw?.energy_kev ?? raw?.EnergyKev ?? raw?.alloy_energy_kev ?? 0),
  intensity_cps: Number(raw?.intensity_cps ?? raw?.IntensityCps ?? raw?.second_energy_kev ?? 0),
  status: raw?.status ?? raw?.Status ?? "published",
  image_url: raw?.image_url ?? raw?.ImageURL ?? raw?.img_url ?? raw?.ImgURL ?? "",
  video_url: raw?.video_url ?? raw?.VideoURL ?? "",
  likes_count: Number(likesCount ?? raw?.likes_count ?? raw?.LikesCount ?? raw?.likes ?? 0),
});

// 1. Каталог (GET /api/alloys?energy=...)
export const getAlloysCatalog = async (maxEnergy: number = 25): Promise<AlloyCatalogResult> => {
  try {
    const response = await fetch(`/api/alloys?energy=${maxEnergy}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const json = await response.json();

    const rawList = Array.isArray(json) ? json : json.alloys || json.results || [];
    const results: Alloys[] = rawList
      .map((item: any) => normalizeAlloy(item.alloy ? item.alloy : item, item.likes))
      .filter((a: Alloys) => a.energy_kev <= maxEnergy);

    return { resultCount: results.length, results };
  } catch (error) {
    console.warn("Бэкенд недоступен, используем ALLOYS_MOCK:", error);
    const filtered = ALLOYS_MOCK.results.filter(
      (a: Alloys) => a.energy_kev <= maxEnergy
    );
    return { resultCount: filtered.length, results: filtered };
  }
};

// 2. Лента (GET /api/alloys/feed)
export const getAlloysFeed = async (id?: number, next: boolean = false): Promise<AlloyFeedResponse> => {
  try {
    const params = new URLSearchParams();
    if (id) params.append("id", String(id));
    if (next) params.append("next", "true");

    const response = await fetch(`/api/alloys/feed?${params.toString()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const json = await response.json();

    const alloy = normalizeAlloy(json.alloy ?? json, json.likes);
    return {
      alloy,
      likes: json.likes ?? alloy.likes_count ?? 0,
      is_mine: json.is_mine ?? 0,
      is_liked: json.is_liked ?? 0,
    };
  } catch (error) {
    console.warn("Бэкенд недоступен, берем ленту из ALLOYS_MOCK:", error);
    const list = ALLOYS_MOCK.results;
    let index = 0;
    if (id) {
      const foundIdx = list.findIndex((a: Alloys) => a.id === id);
      if (foundIdx !== -1) {
        index = next ? (foundIdx + 1) % list.length : foundIdx;
      }
    }
    const fallback = list[index] || list[0];
    return {
      alloy: fallback,
      likes: fallback.likes_count ?? 0,
      is_mine: 0,
      is_liked: 0,
    };
  }
};

// 3. Получение черновика (GET /api/alloys/draft)
// Возвращает null, если черновика нет (чтобы показать 1-ю стадию создания)
export const getAlloysDraft = async (): Promise<Alloys | null> => {
  try {
    const response = await fetch(`/api/alloys/draft`);
    if (!response.ok) return null;
    const json = await response.json();
    const raw = json.alloy ?? json;
    if (!raw || (!raw.id && !raw.ID && !raw.name && !raw.Name && !raw.title && !raw.Title)) {
      return null;
    }
    return normalizeAlloy(raw, json.likes);
  } catch {
    return null;
  }
};

// 4. Создание черновика — стадия 1 (POST /api/alloys)
export const createAlloyDraft = async (name: string, imageFile?: File | null, videoFile?: File | null): Promise<Alloys> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", name);
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    const response = await fetch(`/api/alloys`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const json = await response.json();
      const raw = json.alloy ?? json;
      if (raw && (raw.id || raw.ID)) {
        return normalizeAlloy(raw);
      }
    }
  } catch (e) {
    console.warn("Локальное создание черновика:", e);
  }

  return {
    id: Date.now(),
    title: name,
    description: "",
    energy_kev: 0,
    intensity_cps: 0,
    status: "draft",
    image_url: imageFile ? URL.createObjectURL(imageFile) : "/img/default.png",
    video_url: videoFile ? URL.createObjectURL(videoFile) : "/media/default.mp4",
    likes_count: 0,
  };
};

// 5. Публикация черновика — стадия 2 (PUT /api/alloys/publish)
export const publishAlloyDraft = async (
  id: number,
  energy_kev: number,
  intensity_cps: number,
  description: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/alloys/publish`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, energy_kev, intensity_cps, description }),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// 6. Удаление сплава из каталога (DELETE /api/alloys/:id)
export const deleteAlloyById = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/alloys/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch {
    return false;
  }
};
