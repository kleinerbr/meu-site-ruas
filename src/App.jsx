import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Item from "./pages/Item";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:slug" element={<Item />} />
      </Routes>
    </BrowserRouter>
  );
}
