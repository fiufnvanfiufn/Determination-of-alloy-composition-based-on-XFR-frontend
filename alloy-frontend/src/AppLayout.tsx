import { FC, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Alloys } from "./modules/alloysApi";
import { ALLOYS_MOCK } from "./modules/mock";
import { TabBar } from "./components/TabBar";
import { ROUTES } from "./Routes";

export interface AppOutletContext {
  cards: Alloys[];
  setCards: (cards: Alloys[]) => void;
  energyFilter: string;
  setEnergyFilter: (val: string) => void;
}

export const AppLayout: FC = () => {
  const [cards, setCards] = useState<Alloys[]>(ALLOYS_MOCK.results);
  const [energyFilter, setEnergyFilter] = useState<string>("25  ");
  const location = useLocation();

  const isFeedPage = location.pathname.startsWith(ROUTES.FEED);

  return (
    <div className={`mobile-body ${isFeedPage ? "feed-body" : ""}`}>
      <Outlet context={{ cards, setCards, energyFilter, setEnergyFilter }} />
      <TabBar cards={cards} />
    </div>
  );
};
