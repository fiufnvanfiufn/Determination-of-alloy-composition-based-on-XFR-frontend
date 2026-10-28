import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { Alloys } from "../modules/alloysApi";

interface Props {
  cards: Alloys[];
}

export const TabBar: FC<Props> = ({ cards }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCatalog = location.pathname === ROUTES.CATALOG;
  const isFeed = location.pathname.startsWith(ROUTES.FEED);

  const goToCatalog = () => navigate(ROUTES.CATALOG);

  const goToFeed = () => {
    const firstId = cards[0]?.id;
    if (firstId) {
      navigate(`${ROUTES.FEED}/${firstId}`);
    }
  };

  return (
    <nav className="tab-bar">
      <button
        type="button"
        className={isFeed ? "active-tab" : ""}
        onClick={goToFeed}
      >
        {ROUTE_LABELS.FEED}
      </button>

      {/* Пункт Добавление (недоступен для гостя в 5 лабе) */}
      <button
        type="button"
        className="disabled-tab"
        disabled
        title="Доступно только авторизованным исследователям"
      >
        {ROUTE_LABELS.DRAFT}
      </button>

      <button
        type="button"
        className={isCatalog ? "active-tab" : ""}
        onClick={goToCatalog}
      >
        {ROUTE_LABELS.CATALOG}
      </button>

      {/* Пункт Вход (недоступен в 5 лабе) */}
      <button
        type="button"
        className="disabled-tab"
        disabled
        title="Авторизация будет добавлена в 6 лабораторной работе"
      >
        {ROUTE_LABELS.LOGIN}
      </button>
    </nav>
  );
};
