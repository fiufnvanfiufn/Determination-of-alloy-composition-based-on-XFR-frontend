import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from "react-router-dom";
import { FeedPage } from "./pages/FeedPage";
import { CatalogPage } from "./pages/CatalogPage";
import { DraftPage } from "./pages/DraftPage";
import { Alloys } from "./modules/alloysApi";

const Layout: React.FC = () => {
  const [alloys, setAlloys] = useState<Alloys[]>([]);

  return (
    <div className="mobile-body draft-body">
      <Outlet context={{ alloys, setAlloys }} />

      {/* Нижняя панель навигации */}
      <div className="tab-bar">
        <NavLink
          to="/feed"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Лента
        </NavLink>
        <NavLink
          to="/draft"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Добавление
        </NavLink>
        <NavLink
          to="/catalog"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Каталог
        </NavLink>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/draft" element={<DraftPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
