import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alloys,
  getAlloysDraft,
  createAlloyDraft,
  publishAlloyDraft,
} from "../modules/alloysApi";

export const DraftPage: React.FC = () => {
  const navigate = useNavigate();

  // Если draft === null -> показываем стадию 1 (Создание)
  // Если draft !== null -> показываем стадию 2 (Публикация)
  const [draft, setDraft] = useState<Alloys | null>(null);

  // Поля для 1-й стадии (Создание черновика)
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/img/default.png");
  const [videoPreview, setVideoPreview] = useState<string>("/media/default.mp4");

  // Скрытые input type="file" для выбора файлов с компьютера
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Поля для 2-й стадии (Публикация черновика)
  const [energyKev, setEnergyKev] = useState<string>("");
  const [intensityCps, setIntensityCps] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    getAlloysDraft().then((existingDraft) => {
      if (existingDraft) {
        setDraft(existingDraft);
        setEnergyKev(existingDraft.energy_kev ? String(existingDraft.energy_kev) : "");
        setIntensityCps(existingDraft.intensity_cps ? String(existingDraft.intensity_cps) : "");
        setDescription(existingDraft.description || "");
      }
    });
  }, []);

  // Обработчик выбора изображения с компьютера
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Обработчик выбора видео с компьютера
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Отправка 1-й формы (кнопка "Далее")
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = await createAlloyDraft(name, imageFile, videoFile);
    setDraft(created);
    setEnergyKev(created.energy_kev ? String(created.energy_kev) : "");
    setIntensityCps(created.intensity_cps ? String(created.intensity_cps) : "");
    setDescription(created.description || "");
  };

  // Отправка 2-й формы (кнопка "Опубликовать")
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    await publishAlloyDraft(
      draft.id,
      parseFloat(energyKev) || 0,
      parseInt(intensityCps, 10) || 0,
      description
    );
    setDraft(null);
    navigate("/catalog");
  };

  return (
    <div className="draft-container">
      {draft ? (
        /* === Есть черновик: публикация (Стадия 2) === */
        <form onSubmit={handlePublish}>
          <input type="hidden" name="id" value={draft.id} />

          <div className="draft-media-row">
            <div className="draft-box">
              <span className="draft-box-label"></span>
              <video
                src={draft.video_url || videoPreview || "/media/default.mp4"}
                className="draft-preview-video"
                controls
                muted
              />
            </div>

            <div className="draft-box">
              <span className="draft-box-label"></span>
              <img
                src={draft.image_url || imagePreview || "/img/default.png"}
                alt="Превью"
                className="draft-preview"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/default.png";
                }}
              />
            </div>
          </div>

          <input
            type="text"
            className="draft-input draft-input-spaced"
            placeholder="Название"
            value={draft.title}
            disabled
          />

          <input
            type="text"
            name="energy_kev"
            className="draft-input draft-input-spaced"
            placeholder="Первая высшая частота"
            value={energyKev}
            onChange={(e) => setEnergyKev(e.target.value)}
          />

          <input
            type="text"
            name="intensity_cps"
            className="draft-input draft-input-spaced"
            placeholder="Вторая высшая частота"
            value={intensityCps}
            onChange={(e) => setIntensityCps(e.target.value)}
          />

          <textarea
            name="description"
            className="draft-input draft-input-spaced"
            placeholder="Описание сплава"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" className="filter-btn filter-btn-wide">
            Опубликовать
          </button>
        </form>
      ) : (
        /* === Черновика нет: создание (Стадия 1) === */
        <form onSubmit={handleCreateDraft}>
          {/* Медиа сверху: друг под другом */}
          <div className="draft-media-column">
            <video
              key={videoPreview}
              src={videoPreview}
              className="draft-preview-video"
              controls
              muted
            />
            <img
              src={imagePreview}
              alt="Превью"
              className="draft-preview"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/default.png";
              }}
            />
          </div>

          <input
            type="text"
            name="name"
            className="draft-input"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Скрытые инпуты для выбора файлов с компьютера */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            onChange={handleVideoChange}
          />

          <button
            type="button"
            className="filter-btn filter-btn-wide draft-choose-btn"
            onClick={() => imageInputRef.current?.click()}
          >
            {imageFile ? `Изображение: ${imageFile.name}` : "Выбрать изображение"}
          </button>

          <button
            type="button"
            className="filter-btn filter-btn-wide draft-choose-btn"
            onClick={() => videoInputRef.current?.click()}
          >
            {videoFile ? `Видео: ${videoFile.name}` : "Выбрать видео"}
          </button>

          <button type="submit" className="filter-btn filter-btn-wide">
            Далее
          </button>
        </form>
      )}
    </div>
  );
};

export default DraftPage;
