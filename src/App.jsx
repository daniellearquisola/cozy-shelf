import { useState } from "react"
import { books as initialBooks } from "./data/books"

import BookCard from "./BookCard"

import "./styles.css"

function App() {
  const [books, setBooks] = useState(initialBooks)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const genres = ["All", ...new Set(books.map(book => book.genre))]
  const statuses = ["All", ...new Set(books.map(book => book.status))]

  const filteredBooks = books.filter(book =>
    (selectedGenre === "All" || book.genre === selectedGenre) &&
    (selectedStatus === "All" || book.status === selectedStatus) &&
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleUpdateStatus(id, newStatus) {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id
          ? { ...book, status: newStatus }
          : book
      )
    )
  }

  const counts = books.reduce((acc, book) => {
    if (!acc[book.status]) {
      acc[book.status] = 0
    }
    acc[book.status] += 1
    return acc
  }, {})

  return (
    <div className="app">
      <div className="top-panel">
        <h1>📚 The Cozy Shelf</h1>

        <div className="controls">
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

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="dashboard">
          <span>📖 Want: {counts.want}</span>
          <span>📚 Reading: {counts.reading}</span>
          <span>✅ Finished: {counts.finished}</span>
        </div>
      </div>

      <div className="book-grid">
        {filteredBooks.length === 0 ? (
          <p className="empty">No books match your filters.</p>
        ) : (
          filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App