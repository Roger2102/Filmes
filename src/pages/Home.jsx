import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("batman");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("ratings");
    return saved ? JSON.parse(saved) : {};
  });

  const fetchMovies = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("", { params: { s: query, type: "movie" } });
      setMovies(response.data?.Search || []);
    } catch (err) {
      setError("Não foi possível carregar os filmes.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(search);
  }, []);

  // Favoritar
  const toggleFavorite = (movie) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Avaliar com estrelas
  const handleRating = (movieId, stars) => {
    const updatedRatings = { ...ratings, [movieId]: stars };
    setRatings(updatedRatings);
    localStorage.setItem("ratings", JSON.stringify(updatedRatings));
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold text-primary text-center">Catálogo de Filmes</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchMovies(search);
        }}
        className="d-flex justify-content-center mb-4"
      >
        <input
          type="text"
          className="form-control me-2"
          placeholder="Digite o nome do filme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>Nenhum filme encontrado.</p>}

      <div className="row justify-content-center">
        {movies.map((movie, index) => (
          <div key={`${movie.imdbID}-${index}`} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm">
              {movie?.Poster && movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie?.Title}
                  className="card-img-top"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="bg-secondary text-white text-center p-5">
                  Sem imagem
                </div>
              )}
              <div className="card-body text-center">
                <h5 className="card-title">{movie?.Title}</h5>
                <p className="card-text">{movie?.Year}</p>

                {/* Avaliação com estrelas */}
                <div className="stars mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <span
                      key={star}
                      className={ratings[movie.imdbID] >= star ? "star filled" : "star"}
                      onClick={() => handleRating(movie.imdbID, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Botão Favoritar */}
                <button
                  className="btn-fav mb-2"
                  onClick={() => toggleFavorite(movie)}
                >
                  {favorites.some((fav) => fav.imdbID === movie.imdbID)
                    ? "💔 Remover"
                    : "❤️ Favoritar"}
                </button>

                <Link to={`/movie/${movie.imdbID}`} className="btn btn-primary btn-sm">
                  Ver detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção de favoritos */}
      {favorites.length > 0 && (
        <div className="favorites-section mt-5">
          <h2 className="text-center">⭐ Meus Favoritos</h2>
          <div className="row justify-content-center">
            {favorites.map((fav) => (
              <div key={fav.imdbID} className="col-md-2 mb-3">
                <div className="card shadow-sm fav-card">
                  {fav?.Poster && fav.Poster !== "N/A" ? (
                    <img
                      src={fav.Poster}
                      alt={fav?.Title}
                      className="card-img-top"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="bg-secondary text-white text-center p-3">
                      Sem imagem
                    </div>
                  )}
                  <div className="card-body text-center">
                    <h6 className="card-title">{fav?.Title}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
