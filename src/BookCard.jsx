import StatusBadge from "./components/StatusBadge"

function BookCard({ book, onUpdateStatus }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p>{book.author}</p>

      <span className="genre">{book.genre}</span>

      <StatusBadge status={book.status} />

      {book.favorite && (
        <span className="favorite">⭐ Favorite</span>
      )}

      <div className="book-actions">
        {book.status === "want" && (
          <button
            className="mark-reading-btn"
            onClick={() => onUpdateStatus(book.id, "reading")}
          >
            Mark as Reading
          </button>
        )}

        {book.status === "reading" && (
          <button
            className="mark-finished-btn"
            onClick={() => onUpdateStatus(book.id, "finished")}
          >
            Mark as Finished
          </button>
        )}
      </div>
    </div>
  )
}

export default BookCard