import StatusBadge from "../StatusBadge/StatusBadge"

function BookCard({ book, onUpdateStatus, onToggleFavorite, onRemove }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.author}</p>

      <div className="book-meta">
        <span className="genre">{book.genre}</span>

        <StatusBadge status={book.status} />

        {book.favorite && (
          <span
            className="favorite"
            onClick={() => onToggleFavorite(book.id)}
          >
            ⭐ Favorited
          </span>
        )}
      </div>

      <div className="book-actions">
        {!book.favorite && (
          <button
            className="mark-favorite-btn"
            onClick={() => onToggleFavorite(book.id)}
          >
            ☆ Favorite This Book
          </button>
        )}

        {book.status === "want" && (
          <button
            className="mark-reading-btn"
            onClick={() => onUpdateStatus(book.id, "reading")}
          >
            Start Reading
          </button>
        )}
      </div>
      
      <button
        className="remove-book-btn"
        onClick={() => onRemove(book.id)}
      >
        Remove
      </button>
    </div>
  )
}

export default BookCard