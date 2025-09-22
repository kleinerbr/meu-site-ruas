import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Item from "./pages/Item";

export default function App() {
  return (
    <div>
      <nav style={{ padding: 10, background: "#eee" }}>
        <Link to="/">Início</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:slug" element={<Item />} />
      </Routes>
    </div>
  );
}
