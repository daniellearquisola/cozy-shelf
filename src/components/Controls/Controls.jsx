function Controls({
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  searchBooks,
  genres,
  statuses
}) {
  return (
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
  )
}

export default Controls