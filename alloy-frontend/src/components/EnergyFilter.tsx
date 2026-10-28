import type { FC } from "react";
import { Button } from "react-bootstrap";

interface Props {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  buttonTitle?: string;
}

export const EnergyFilter: FC<Props> = ({
  value,
  setValue,
  onSubmit,
  loading,
  buttonTitle = "Применить",
}) => {
  const numericValue = value !== "" && !Number.isNaN(Number(value)) ? Number(value) : 25;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="filter-slider-container">
      <div className="slider-header">
        <span className="slider-title">Частота:</span>
        <span className="slider-current-val">
          {numericValue >= 25 ? `25 кэВ (Все)` : `≤ ${numericValue} кэВ`}
        </span>
      </div>

      <input
        type="range"
        name="energy"
        min={0}
        max={25}
        step={0.01}
        value={numericValue}
        onChange={(event) => setValue(event.target.value)}
        className="range-slider"
      />

      <div className="filter-actions">
        <Button type="submit" className="filter-btn" disabled={loading}>
          {buttonTitle}
        </Button>
      </div>
    </form>
  );
};

export default EnergyFilter;
