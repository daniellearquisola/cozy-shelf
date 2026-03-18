import { useState, useEffect, useRef } from "react"
import { books as initialBooks } from "./data/books"

import BookCard from "./components/BookCard/BookCard"
import Controls from "./components/Controls/Controls"
import Dashboard from "./components/Dashboard/Dashboard"
import SearchResults from "./components/SearchResults/SearchResults"

import "./styles/styles.css"

function App() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books")
    return savedBooks ? JSON.parse(savedBooks) : initialBooks
  })
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

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

  function toggleFavorite(id) {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id
          ? {...book, favorite: !book.favorite}
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
              onUpdateStatus={handleUpdateStatus}
              onToggleFavorite={toggleFavorite}
              onRemove={removeBook}
            />
          ))
        )}
      </div>

      {searchResults.length > 0 && (
        <SearchResults
          searchResults={searchResults}
          addBook={addBook}
          clearSearchResults={clearSearchResults}
          resultsRef={resultsRef}
        />
      )}
    </div>
  )
}

export default App