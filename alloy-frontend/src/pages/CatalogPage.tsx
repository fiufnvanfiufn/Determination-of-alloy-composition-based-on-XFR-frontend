import { type FC, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAlloysByEnergy } from "../modules/alloysApi";
import { ALLOYS_MOCK } from "../modules/mock";
import { EnergyFilter } from "../components/EnergyFilter";
import { AlloyCard } from "../components/AlloysCard";
import { ROUTES } from "../Routes";
import type { AppOutletContext } from "../AppLayout";

export const CatalogPage: FC = () => {
  const { cards, setCards, energyFilter, setEnergyFilter } =
    useOutletContext<AppOutletContext>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const applyMock = () => {
    const maxEnergy = parseFloat(energyFilter);
    const limit = Number.isNaN(maxEnergy) ? 25 : maxEnergy;

    const filtered = ALLOYS_MOCK.results.filter(
      (item) => item.status === "published" && item.energy_kev <= limit
    );
    setCards(filtered);
    setLoading(false);
  };

  const handleSearch = () => {
    setLoading(true);
    getAlloysByEnergy(energyFilter)
      .then((response) => {
        if (response.results) {
          const maxEnergy = parseFloat(energyFilter);
          const limit = Number.isNaN(maxEnergy) ? 25 : maxEnergy;
          const filtered = response.results.filter(
            (item) => item.energy_kev <= limit
          );
          setCards(filtered);
          setLoading(false);
          return;
        }
        applyMock();
      })
      .catch(applyMock);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.FEED}/${id}`);
  };

  const handleDeleteAlloy = (id: number) => {
    fetch(`/api/alloyDelete/${id}`, { method: "DELETE" }).catch(() => {});

    const target = ALLOYS_MOCK.results.find((item) => item.id === id);
    if (target) {
      target.status = "deleted";
    }
    setCards(cards.filter((item) => item.id !== id));
  };

  return (
    <div>
      <EnergyFilter
        value={energyFilter}
        setValue={setEnergyFilter}
        loading={loading}
        onSubmit={handleSearch}
      />

      {loading && (
        <div style={{ textAlign: "center", padding: "30px" }}>
          <Spinner animation="border" />
        </div>
      )}

      {!loading &&
        (!cards.length ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Сплавы с частотой ≤ {energyFilter} кэВ не найдены</p>
          </div>
        ) : (
          <div className="grid">
            {cards.map((item) => (
              <AlloyCard
                key={item.id}
                {...item}
                onClick={() => handleCardClick(item.id)}
                onDelete={handleDeleteAlloy}
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default CatalogPage;
