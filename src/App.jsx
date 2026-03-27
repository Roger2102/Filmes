import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<Home />} />

        {/* Rota dinâmica para detalhes */}
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
