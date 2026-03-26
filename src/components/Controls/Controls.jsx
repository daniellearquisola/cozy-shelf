function Controls({
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
  showFavorites,
  setShowFavorites,
  searchTerm,
  setSearchTerm,
  searchBooks,
  genres,
  statuses
}) {
  return (
    <div className="controls">
        <div className="filters flex flex-wrap items-end gap-4">
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

            <button
                onClick={() => setShowFavorites(prev => !prev)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition flex items-center gap-2
                    ${showFavorites 
                    ? "bg-amber-400 text-white border-amber-400" 
                    : "bg-white hover:bg-gray-100 border-gray-300"}
                `}
                >
                ⭐ {showFavorites ? "Show All" : "Show Favorites"}
            </button>
        </div>

        <div className="flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="Search My Shelf..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-white"
            />

            <input
                type="text"
                placeholder="Search Open Library..."
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    searchBooks(e.target.value)
                }
                }}
                className="px-3 py-2 rounded-lg border bg-white"
            />
        </div>
    </div>
  )
}

export default Controls