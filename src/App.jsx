// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Item from "./pages/Item"; // opcional: rota direta pelo slug
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Página inicial agora usa MainLayout */}
      <Route path="/" element={<MainLayout />} />

      {/* rota direta para compartilhar detalhes de um item */}
      <Route path="/item/:slug" element={<Item />} />
    </Routes>
  );
}
