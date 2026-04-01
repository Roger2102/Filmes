import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get("", { params: { i: id } });
        if (response.data?.Response === "False") {
          setError("Filme não encontrado.");
        } else {
          setMovie(response.data);
        }
      } catch {
        setError("Erro ao carregar detalhes.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  // Função para renderizar estrelas com base no imdbRating
  const renderStars = (rating) => {
    if (!rating || rating === "N/A") return "☆☆☆☆☆";
    const stars = Math.round(parseFloat(rating) / 2); // imdbRating é de 0 a 10
    return "★★★★★".slice(0, stars) + "☆☆☆☆☆".slice(stars);
  };

  return (
    <div className="movie-detail-container">
      <h1>{movie?.Title}</h1>
      <div className="movie-detail-row">
        <div className="movie-poster">
          {movie?.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={movie?.Title}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : null}
        </div>
        <div className="movie-info">
          <ul>
            <li>
              <strong>Ano:</strong> {movie?.Year}
            </li>
            <li>
              <strong>Diretor:</strong> {movie?.Director}
            </li>
            <li>
              <strong>Elenco:</strong> {movie?.Actors}
            </li>
            <li>
              <strong>Gênero:</strong> {movie?.Genre}
            </li>
            <li>
              <strong>Duração:</strong> {movie?.Runtime}
            </li>
            <li>
              <strong>Idioma:</strong> {movie?.Language}
            </li>
            <li>
              <strong>IMDb Rating:</strong> {movie?.imdbRating}
            </li>
            <li>
              <strong>Avaliação:</strong>{" "}
              <span className="stars">{renderStars(movie?.imdbRating)}</span>
            </li>
            <li>
              <strong>Sinopse:</strong> {movie?.Plot}
            </li>
          </ul>
          <Link to="/" className="btn-secondary">
            ⬅ Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
