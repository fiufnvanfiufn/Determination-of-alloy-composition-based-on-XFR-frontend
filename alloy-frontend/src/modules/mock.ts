import { AlloysCatalogResult } from "./alloysApi";
import defaultImg from "../assets/свинец.jpg";
import defaultVideo from "../assets/свинец.mp4";

export const ALLOYS_MOCK: AlloysCatalogResult = {
  resultCount: 5,
  results: [
    {
      id: 1,
      title: "Оловянистая бронза (Скифы)",
      description: "Классическая высокооловянистая бронза скифского типа (Cu-Sn). Анализ показывает четкий пик олова без значительных примесей мышьяка.",
      energy_kev: 8.04,
      intensity_cps: 6.59,
      status: "published",
      image_url: defaultImg,
      video_url: defaultVideo,
      likes_count: 3,
    },
    {
      id: 3,
      title: "Электрум (Лидия)",
      description: "Природный сплав золота и серебра из бассейна реки Пактол. Наличие небольшого пика меди подтверждает подлинность монеты.",
      energy_kev: 9.71,
      intensity_cps: 7.81,
      status: "published",
      image_url: defaultImg,
      video_url: defaultVideo,
      likes_count: 4,
    },
    {
      id: 5,
      title: "Серебряный денарий (Рим)",
      description: "Высокопробное серебро. Характерно для чеканки эпохи ранней Римской Империи.",
      energy_kev: 22.16,
      intensity_cps: 10.39,
      status: "published",
      image_url: defaultImg,
      video_url: defaultVideo,
      likes_count: 3,
    },
    {
      id: 6,
      title: "Мышьяковистая бронза",
      description: "Ранний бронзовый век. Сплав Cu-As, предшественник оловянной бронзы. Высокий пик мышьяка.",
      energy_kev: 10.53,
      intensity_cps: 4.92,
      status: "published",
      image_url: defaultImg,
      video_url: defaultVideo,
      likes_count: 4,
    },
    {
      id: 7,
      title: "Свинцовая булла (Византия)",
      description: "Вислая печать. Четкий пик свинца без значительных примесей серебра или олова.",
      energy_kev: 10.55,
      intensity_cps: 5.68,
      status: "published",
      image_url: defaultImg,
      video_url: defaultVideo,
      likes_count: 1,
    },
  ],
};
