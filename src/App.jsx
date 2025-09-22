import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Item from "./pages/Item";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* rota direta para compartilhar apenas os detalhes */}
      <Route path="/item/:slug" element={<Item />} />
    </Routes>
  );
}
