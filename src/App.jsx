import { useContext, useState, useEffect, useRef } from "react"

import BookCard from "./components/BookCard/BookCard"
import BookContext from "./context/BookContext"
import Controls from "./components/Controls/Controls"
import Dashboard from "./components/Dashboard/Dashboard"
import SearchResults from "./components/SearchResults/SearchResults"

import "./styles/styles.css"

function App() {
  const { books, addBook, removeBook, toggleFavorite, handleUpdateStatus } = useContext(BookContext)
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const resultsRef = useRef(null)

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

  const counts = books.reduce((acc, book) => {
    if (!acc[book.status]) {
      acc[book.status] = 0
    }
    acc[book.status] += 1
    return acc
  }, {})

  async function searchBooks(query) {
    setIsLoading(true)
    setHasSearched(true)

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
      setIsLoading(false)

    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  function clearSearchResults() {
    setSearchResults([])
  }

  return (
    <div className="app">
      <div className="top-panel">
        <h1>📚 The Cozy Shelf</h1>

        <Controls
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchBooks={searchBooks}
          genres={genres}
          statuses={statuses}
        />

        <Dashboard counts={counts} />
      </div>

      {isLoading && (
        <p className="loading">Searching open library...</p>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <p className="no-results">No books found. Try another search.</p>
      )}

      <div className="book-grid">
        {filteredBooks.length === 0 ? (
          <p className="empty">No books match your filters.</p>
        ) : (
          filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))
        )}
      </div>

      {searchResults.length > 0 && (
        <SearchResults
          searchResults={searchResults}
          clearSearchResults={clearSearchResults}
          resultsRef={resultsRef}
        />
      )}
    </div>
  )
}

export default App