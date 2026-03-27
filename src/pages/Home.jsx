import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("batman");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  async function loadMovies() {
    try {
      const response = await api.get("", {
        params: { s: search, page, type, y: year },
      });
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }

  useEffect(() => {
    loadMovies();
  }, [page, type, year]);

  // ordenação
  let sortedMovies = [...movies];
  if (sort === "title") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sort === "year") {
    sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  // favoritos
  function toggleFavorite(movie) {
    let updated;
    if (favorites.find((fav) => fav.imdbID === movie.imdbID)) {
      updated = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 fw-bold text-primary">
        🎬 Catálogo de Filmes
      </h1>

      {/* Busca */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          loadMovies();
        }}
      >
        <div className="input-group mb-3 shadow-sm">
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Digite o nome do filme"
          />
          <button type="submit" className="btn btn-primary fw-bold">
            Buscar
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos</option>
            <option value="movie">Filmes</option>
            <option value="series">Séries</option>
            <option value="episode">Episódios</option>
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            placeholder="Filtrar por ano (ex: 2005)"
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sem ordenação</option>
            <option value="title">Ordenar por título (A-Z)</option>
            <option value="year">Ordenar por ano (antigo → recente)</option>
          </select>
        </div>
      </div>

      {/* Lista de filmes */}
      <div className="row">
        {sortedMovies.length > 0 ? (
          sortedMovies.map((movie) => (
            <div className="col-md-6 mb-4" key={movie.imdbID}>
              <div className="card h-100 shadow-lg border-0 rounded-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    {movie.Poster && movie.Poster !== "N/A" && (
                      <img
                        src={movie.Poster}
                        className="img-fluid rounded-start"
                        alt={movie.Title}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{movie.Title}</h5>
                      <p className="card-text text-muted">
                        📅 Ano: {movie.Year}
                      </p>
                      <p className="card-text">
                        🎬 Tipo: {movie.Type === "movie" ? "Filme" : movie.Type}
                      </p>
                      <div className="d-flex gap-2 mt-3">
                        <Link
                          to={`/movie/${movie.imdbID}`}
                          className="btn btn-primary"
                        >
                          Ver detalhes
                        </Link>
                        <button
                          className={`btn ${favorites.find((fav) => fav.imdbID === movie.imdbID) ? "btn-danger" : "btn-outline-secondary"}`}
                          onClick={() => toggleFavorite(movie)}
                        >
                          {favorites.find((fav) => fav.imdbID === movie.imdbID)
                            ? "Remover"
                            : "❤️ Favorito"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-warning text-center">
            Nenhum filme encontrado.
          </div>
        )}
      </div>

      {/* Paginação */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Página anterior
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Próxima página
        </button>
      </div>

      {/* Favoritos */}
      <div className="mt-5">
        <h3 className="fw-bold">⭐ Meus Favoritos</h3>
        {favorites.length > 0 ? (
          <ul className="list-group shadow-sm">
            {favorites.map((fav) => (
              <li
                key={fav.imdbID}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {fav.Title} ({fav.Year})
                <Link
                  to={`/movie/${fav.imdbID}`}
                  className="btn btn-sm btn-primary"
                >
                  Ver detalhes
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Nenhum favorito ainda.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
