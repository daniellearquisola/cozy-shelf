import { useContext } from "react"
import BookContext from "../../context/BookContext"
import StatusBadge from "../StatusBadge/StatusBadge"


function BookCard({ book }) {
  const {
    removeBook,
    toggleFavorite,
    handleUpdateStatus
  } = useContext(BookContext)
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
            onClick={() => toggleFavorite(book.id)}
          >
            ⭐ Favorited
          </span>
        )}
      </div>

      <div className="book-actions">
        {!book.favorite && (
          <button
            className="mark-favorite-btn"
            onClick={() => toggleFavorite(book.id)}
          >
            ☆ Favorite This Book
          </button>
        )}

        {book.status === "want" && (
          <button
            className="mark-reading-btn"
            onClick={() => handleUpdateStatus(book.id, "reading")}
          >
            Start Reading
          </button>
        )}
      </div>
      
      <button
        className="remove-book-btn"
        onClick={() => removeBook(book.id)}
      >
        Remove
      </button>
    </div>
  )
}

export default BookCard