import type { FC, MouseEvent } from "react";
import { Card } from "react-bootstrap";
import type { Alloys } from "../modules/alloysApi";

const defaultImage = "/default.png";

interface ICardProps extends Alloys {
  onClick: () => void;
  onDelete: (id: number) => void;
}

export const AlloyCard: FC<ICardProps> = ({
  id,
  title,
  energy_kev,
  image_url,
  likes_count,
  onClick,
  onDelete,
}) => {
  const shortTitle = title.length > 7 ? `${title.slice(0, 7)}...` : title;

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <Card className="card-custom" onClick={onClick}>
      <Card.Img
        variant="top"
        src={image_url || defaultImage}
        alt={title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = defaultImage;
        }}
      />

      {/* Блок с названием и частотой */}
      <div className="card-info">
        <span className="card-title-link" title={title}>
          {shortTitle}
        </span>
        <div className="card-frequency">
          Частота: {energy_kev} кэВ
        </div>
      </div>

      {/* Нижняя плашка: слева крестик удаления, справа лайки */}
      <div className="card-footer-custom">
        <button
          type="button"
          className="card-delete-btn"
          onClick={handleDeleteClick}
          title="Удалить сплав"
        >
          ✖
        </button>

        <div className="card-heart">
          {likes_count} 🤍
        </div>
      </div>
    </Card>
  );
};
