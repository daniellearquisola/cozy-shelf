import { useState } from "react"
import './styles.css'
import { books as initialBooks } from "./data/books"
import StatusBadge from './components/StatusBadge'

function App() {
  const [books, setBooks] = useState(initialBooks)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const genres = ["All", ...new Set(books.map(book => book.genre))]
  const statuses = ["All", ...new Set(books.map(book => book.status))]

  const filteredBooks = books.filter(book =>
    (selectedGenre === "All" || book.genre === selectedGenre) &&
    (selectedStatus === "All" || book.status === selectedStatus)
  )

  function handleUpdateStatus(id, newStatus) {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === id) {
          return { ...book, status: newStatus }
        }
        return book
      })
    )
  }

  return (
    <div className="app">
      <h1>📚 The Cozy Shelf</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Genre</label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
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
                  onClick={() => handleUpdateStatus(book.id, "reading")}
                >
                  Mark as Reading
                </button>
              )}

              {book.status === "reading" && (
                <button
                  className="mark-finished-btn"
                  onClick={() => handleUpdateStatus(book.id, "finished")}
                >
                  Mark as Finished
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App