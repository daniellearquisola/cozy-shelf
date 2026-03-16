import { useState, useEffect, useRef } from "react"
import { books as initialBooks } from "./data/books"

import BookCard from "./components/BookCard"

import "./styles.css"

function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books")
    return savedBooks ? JSON.parse(savedBooks) : initialBooks
  })
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const resultsRef = useRef(null)

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books))
  }, [books])

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch(
        "https://openlibrary.org/search.json?q=fantasy"
      )

      const data = await response.json()

      const apiBooks = data.docs.slice(0, 20).map((book, index) => ({
        id: `api-${index}`,
        title: book.title,
        author: book.author_name?.[0] || "Unknown",
        genre: "Fantasy",
        status: "want",
        favorite: false
      }))

      setBooks(prev => {
        const alreadyHasApiBooks = prev.some(book =>
          String(book.id).startsWith("api-")
        )

        if (alreadyHasApiBooks) {
          return prev
        }

        return [...prev, ...apiBooks]
      })
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchResults.length > 0) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }, [searchResults])

  console.log("All books:", books)

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

  async function searchBooks(query) {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      )

      const data = await response.json()

      const results = data.docs.slice(0, 20).map((book, index) => ({
        id: `search-${index}`,
        title: book.title,
        author: book.author_name?.[0] || "Unknown",
        genre: book.subject?.[0] || "Unknown",
        status: "want",
        favorite: false
      }))

      setSearchResults(results)

    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  function addBook(book) {
    setBooks(prev => {
      const alreadyExists = prev.some(
        b => b.title === book.title && b.author === book.author
      )

      if (alreadyExists) return prev

      return [...prev, book]
    })
  }

  function removeBook(id) {
    setBooks(prev =>
      prev.filter(book => book.id !== id)
    )
  }

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
              placeholder="Search My Shelf..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            />
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Open Library..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchBooks(e.target.value)
                }
              }}
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
              onRemove={removeBook}
            />
          ))
        )}
      </div>

      {searchResults.length > 0 && (
        <div ref={resultsRef} className="search-results">
          <h2>🔎 Search Results</h2>

          <div className="book-grid">
            {searchResults.map(book => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>{book.author}</p>

                <span className="genre">{book.genre}</span>

                <button
                  className="add-book-btn"
                  onClick={() => addBook(book)}
                >
                  ➕ Add to Shelf
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App