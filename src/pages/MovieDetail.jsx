import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function loadMovie() {
      try {
        const response = await api.get("", { params: { i: id } });
        setMovie(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      }
    }

    loadMovie();
  }, [id]);

  if (!movie) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (movie.Response === "False") {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">
          Filme não encontrado.
        </div>
        <Link to="/" className="btn btn-secondary">
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        {movie.Poster && movie.Poster !== "N/A" && (
          <img src={movie.Poster} className="card-img-top" alt={movie.Title} />
        )}
        <div className="card-body">
          <h3 className="card-title">{movie.Title}</h3>
          <p className="card-text">
            <strong>Ano:</strong> {movie.Year}
          </p>
          <p className="card-text">
            <strong>Diretor:</strong> {movie.Director}
          </p>
          <p className="card-text">
            <strong>Gênero:</strong> {movie.Genre}
          </p>
          <p className="card-text">
            <strong>Enredo:</strong> {movie.Plot}
          </p>

          {/* Avaliações */}
          <h5 className="mt-4">Avaliações</h5>
          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <p>
              <strong>IMDb:</strong> {movie.imdbRating}/10
            </p>
          )}
          {movie.Metascore && movie.Metascore !== "N/A" && (
            <p>
              <strong>Metascore:</strong> {movie.Metascore}
            </p>
          )}
          {movie.Ratings && movie.Ratings.length > 0 && (
            <ul>
              {movie.Ratings.map((rating, index) => (
                <li key={index}>
                  <strong>{rating.Source}:</strong> {rating.Value}
                </li>
              ))}
            </ul>
          )}

          <Link to="/" className="btn btn-secondary mt-3">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
