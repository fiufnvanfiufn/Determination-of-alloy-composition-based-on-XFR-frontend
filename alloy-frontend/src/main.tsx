import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import "./index.css"; // убедись, что здесь подключены твои стили из resources/styles/style.css

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Регистрация Service Worker для PWA (Лабораторная №6)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service Worker зарегистрирован:", reg.scope))
      .catch((err) => console.error("Ошибка регистрации Service Worker:", err));
  });
}
