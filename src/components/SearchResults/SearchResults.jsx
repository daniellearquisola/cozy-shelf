function SearchResults({
  searchResults,
  addBook,
  clearSearchResults,
  resultsRef
}) {
  return (
    <div ref={resultsRef} className="search-results">
      <h2>🔎 Search Results</h2>

      <button
        className="clear-results-btn"
        onClick={clearSearchResults}
      >
        Clear Results
      </button>

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
  )
}

export default SearchResults