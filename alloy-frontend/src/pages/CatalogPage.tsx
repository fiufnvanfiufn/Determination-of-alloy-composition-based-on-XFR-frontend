import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setMaxEnergy } from "../store/filterSlice";
import { Alloys, getAlloysCatalog, deleteAlloyById } from "../modules/alloysApi";

interface OutletContextType {
  alloys: Alloys[];
  setAlloys: React.Dispatch<React.SetStateAction<Alloys[]>>;
}

export const CatalogPage: React.FC = () => {
  const { alloys, setAlloys } = useOutletContext<OutletContextType>();
  const maxEnergy = useSelector((state: RootState) => state.filter.maxEnergy);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadCatalog = async (energy: number) => {
    setLoading(true);
    const res = await getAlloysCatalog(energy);
    setAlloys(res.results);
    setLoading(false);
  };

  // Загружаем каталог при первом заходе с текущим значением фильтра из Redux
  useEffect(() => {
    loadCatalog(maxEnergy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Отправка запроса ТОЛЬКО по кнопке "Применить"
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadCatalog(maxEnergy);
  };

  // Удаление карточки по нажатию на красный крестик
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteAlloyById(id);
    setAlloys((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="catalog-container">
      {/* Фильтрация слайдером с кнопкой Применить */}
      <form onSubmit={handleApplyFilter} className="filter-slider-container">
        <div className="slider-header">
          <span className="slider-title">Макс. частота (до):</span>
          <span className="slider-current-val">
            {maxEnergy >= 25 ? "25 кэВ (Все)" : `≤ ${maxEnergy} кэВ`}
          </span>
        </div>

        <input
          type="range"
          name="energy"
          min={0}
          max={25}
          step={0.01}
          value={maxEnergy}
          onChange={(e) => dispatch(setMaxEnergy(parseFloat(e.target.value)))}
          className="range-slider"
        />

        <div className="filter-actions">
          <button type="submit" className="filter-btn" disabled={loading}>
            Применить
          </button>
        </div>
      </form>

      {/* Плитка карточек */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>Загрузка...</div>
      ) : (
        <div className="grid">
          {alloys.map((item) => {
            const shortTitle =
              item.title.length > 7 ? `${item.title.slice(0, 7)}...` : item.title;

            return (
              <div
                key={item.id}
                className="card-custom"
                onClick={() => navigate(`/feed?id=${item.id}`)}
              >
                {/* Красная кнопка удаления (крестик) */}
                <button
                  type="button"
                  className="card-delete-btn"
                  onClick={(e) => handleDelete(e, item.id)}
                  title="Удалить сплав"
                >
                  ✖
                </button>

                <img
                  src={item.image_url || "/default.png"}
                  alt={item.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/default.png";
                  }}
                />

                <div className="card-info">
                  <span className="card-title-link" title={item.title}>
                    {shortTitle}
                  </span>
                  <div className="card-frequency">
                    Частота: {item.energy_kev} кэВ
                  </div>
                </div>

                <div className="card-footer-custom">
                  <div className="card-heart">{item.likes_count ?? 0} 🤍</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
